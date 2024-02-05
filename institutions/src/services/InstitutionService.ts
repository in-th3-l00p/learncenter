import {prisma} from "../utils/objects";
import {ServiceError} from "dtos";
import {nc} from "../events/nats";

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
    }
}

const institutionService = new InstitutionService();
export default institutionService;