import {prisma} from "../utils/objects";
import {ServiceError} from "types";
import logger from "logger";
import Amqp from "streaming";
import {EventType} from "streaming/src/event";
import {Prisma, UserRole} from "@prisma/client";

class InstitutionService {
    public async getInstitution(id: number, userId: number) {
        const institution = await prisma.institution.findUnique({
            where: { id }
        });
        if (!institution)
            throw new ServiceError(404, ["Institution not found"]);
        await this.checkUserInInstitution(userId, institution.id);
        return institution;
    }

    public async getInstitutions(userId: number) {
        return (await prisma.usersOnInstitutions.findMany({
            include: { institution: true },
            where: {
                userId: userId,
                role: {
                    notIn: ["PENDING", "BANNED", "DELETED"]
                }
            }
        })).map(u => u.institution);
    }

    public async createInstitution(
        name: string,
        description: string,
        userId: number
    ) {
        const institution = await prisma.institution.create({
            data: {
                name,
                description,
                owner: {
                    connect: {id: userId}
                },
                users: {
                    connect: {id: userId}
                }
            }
        });
        Amqp.getInstance().publish({
            type: EventType.INSTITUTION_CREATED,
            data: institution
        })

        await prisma.usersOnInstitutions.create({
            data: {
                user: {connect: {id: userId}},
                institution: {connect: {id: institution.id}},
                role: "ADMIN"
            }
        });
        Amqp.getInstance().publish({
            type: EventType.USER_JOINED_INSTITUTION,
            data: {
                user: userId,
                institution: institution.id,
                role: "ADMIN"
            }
        });

        logger.info("Created institution " + institution.id + ".");
        return institution;
    }

    public async updateInstitution(
        id: number,
        name: string,
        description: string,
        userId: number
    ) {
        const institution = await prisma.institution.update({
            where: {
                id,
                users: {
                    some: {id: userId}
                }
            },
            data: {name, description}
        });
        if (!institution)
            throw new ServiceError(404, ["Institution not found"]);

        Amqp.getInstance().publish({
            type: EventType.INSTITUTION_UPDATED,
            data: institution
        });
        logger.info("Updated institution " + institution.id + ".");
        return institution;
    }

    public async deleteInstitution(id: number, userId: number) {
        if (await prisma.institution.count({
            where: {
                id,
                users: {
                    some: {id: userId}
                }
            }}) === 0)
            throw new ServiceError(404, ["Institution not found"]);

        await prisma.institution.delete({
            where: {
                id,
                users: {
                    some: {id: userId}
                }
            }
        });
        Amqp.getInstance().publish({
            type: EventType.INSTITUTION_DELETED,
            data: {id}
        });
        logger.info("Deleted institution " + id + ".");
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

const institutionService = new InstitutionService();
export default institutionService;