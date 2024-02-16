import {prisma} from "../utils/objects";
import {ServiceError} from "types";
import {nc} from "../events/nats";
import logger from "logger";

class InstitutionService {
    public async getInstitution(id: number, userId: number) {
        const institution = await prisma.institution.findUnique({
            where: {
                id,
                users: {
                    some: { id: userId }
                }
            }
        });
        if (!institution)
            throw new ServiceError(404, ["Institution not found"]);
        return institution;
    }

    public async getInstitutions(userId: number) {
        return prisma.institution.findMany({
            where: {
                users: { some: { id: userId } }
            }
        });
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

        nc.publish("institution:created", JSON.stringify(institution));
        logger.info("Created institution " + institution.id + ".");

        await prisma.usersOnInstitutions.create({
            data: {
                user: {connect: {id: userId}},
                institution: {connect: {id: institution.id}},
                role: "ADMIN"
            }
        });
        nc.publish("user:joined", JSON.stringify({
            userId,
            institutionId: institution.id,
            role: "ADMIN"
        }));

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
        nc.publish("institution:updated", JSON.stringify(institution));
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
        nc.publish("institution:deleted", JSON.stringify({id}));
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

        nc.publish("user:invited", JSON.stringify({
            institutionId,
            userId
        }));
        return user;
    }

    public async getUsers(institutionId: number) {
        return prisma.usersOnInstitutions.findMany({
            where: {institutionId}
        });
    }
}

const institutionService = new InstitutionService();
export default institutionService;