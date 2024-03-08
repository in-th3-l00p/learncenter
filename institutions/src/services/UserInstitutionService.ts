import {prisma} from "../utils/objects";
import {ServiceError} from "types";
import Amqp from "streaming";
import {EventType} from "streaming/src/event";
import logger from "logger";
import {UserRole} from "@prisma/client";

class UserInstitutionService {
    public async checkUserInInstitution(
        userId: number,
        institutionId: number
    ) {
        if (await prisma.usersOnInstitutions.count({
            where: {
                userId,
                institutionId,
                role: {
                    notIn: ["PENDING", "BANNED", "DELETED"]
                }
            }
        }) === 0)
            throw new ServiceError(403, ["User not in institution"]);
    }

    public async inviteUser(
        institutionId: number,
        userId: number
    ) {
        const user = await prisma.user.findUnique({
            where: {id: userId}
        });
        if (!user)
            throw new ServiceError(404, ["User not found"]);

        const institution = await prisma.institution.findUnique({
            where: {id: institutionId}
        });
        if (!institution)
            throw new ServiceError(404, ["Institution not found"]);

        if (await prisma.usersOnInstitutions.count({
            where: {
                userId: user.id,
                institutionId
            }
        }) > 0)
            throw new ServiceError(400, ["User already in institution"]);

        await prisma.usersOnInstitutions.create({
            data: {
                user: {connect: {id: user.id}},
                institution: {connect: {id: institution.id}},
                role: "PENDING"
            }
        });

        Amqp.getInstance().publish({
            type: EventType.USER_INVITED,
            data: {
                user: user.id,
                institution: institution.id
            }
        });
        logger.info("Invited user " + user.id + " to institution " + institution.id + ".");

        return user;
    }

    public async acceptUser(
        institutionId: number,
        userId: number
    ) {
        const relation = await prisma.usersOnInstitutions.updateMany({
            where: {
                institutionId,
                userId,
                role: "PENDING"
            },
            data: {
                role: "USER"
            }
        });

        if (relation.count === 0)
            throw new ServiceError(404, ["Invitation not found"]);

        Amqp.getInstance().publish({
            type: EventType.USER_JOINED_INSTITUTION,
            data: {
                user: userId,
                institution: institutionId,
                role: "USER"
            }
        });
        logger.info("User " + userId + " accepted into institution " + institutionId + ".");
    }

    public async getUsers(
        institutionId?: number,
        userId?: number,
        role?: UserRole
    ) {
        return prisma.usersOnInstitutions.findMany({
            where: {
                institutionId: institutionId,
                userId: userId,
                role: role
            },
            include: { user: true, institution: true }
        });
    }

    public async removeUser(
        institutionId: number,
        userId: number
    ) {
        if (await prisma.usersOnInstitutions.count({
            where: {
                userId,
                institutionId
            }
        }) === 0)
            throw new ServiceError(404, ["User not in institution"]);

        await prisma.usersOnInstitutions.deleteMany({
            where: {
                userId,
                institutionId
            }
        });
        Amqp.getInstance().publish({
            type: EventType.USER_LEFT_INSTITUTION,
            data: {
                user: userId,
                institution: institutionId
            }
        });
        logger.info("Removed user " + userId + " from institution " + institutionId + ".");
    }
}

const userInstitutionService = new UserInstitutionService();
export default userInstitutionService;
