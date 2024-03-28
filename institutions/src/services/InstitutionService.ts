import {prisma} from "../utils/objects";
import {ServiceError} from "types";
import logger from "logger";
import Amqp from "streaming";
import {EventType} from "streaming/src/event";
import userInstitutionService from "./UserInstitutionService";

class InstitutionService {
    public async getInstitution(id: number, userId: number) {
        const institution = await prisma.institution.findUnique({
            where: { id }
        });
        if (!institution)
            throw new ServiceError(404, [{msg: "Institution not found"}]);
        await userInstitutionService
            .checkUserInInstitution(userId, institution.id);
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
            throw new ServiceError(404, [{msg: "Institution not found"}]);

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
            throw new ServiceError(404, [{msg: "Institution not found"}]);

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
}

const institutionService = new InstitutionService();
export default institutionService;