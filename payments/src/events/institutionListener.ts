import nats from "nats";
import logger from "logger";
import {InstitutionDto} from "dtos";
import {prisma} from "../utils/objects";

async function institutionCreatedListener(nc: nats.NatsConnection) {
    const sub = nc.subscribe("institution:created");
    for await (const data of sub) {
        const institution = data.json() as InstitutionDto;
        prisma.institution.create({
            data: {
                id: institution.id,
                name: institution.name,
                description: institution.description,
                createdAt: institution.createdAt
            }
        })
            .then((institution) => {
                logger.info("Institution created: " + JSON.stringify(institution));
            })
            .catch((e) => {
                logger.error("Error creating institution: " + e);
            });
    }
}

async function institutionUpdatedListener(nc: nats.NatsConnection) {
    const sub = nc.subscribe("institution:updated");
    for await (const data of sub) {
        const institution = data.json() as InstitutionDto;
        prisma.institution.update({
            where: {
                id: institution.id
            },
            data: {
                name: institution.name,
                description: institution.description
            }
        })
            .then((institution) => {
                logger.info("Institution updated: " + JSON.stringify(institution));
            })
            .catch((e) => {
                logger.error("Error updating institution: " + e);
            });
    }
}

async function institutionDeletedListener(nc: nats.NatsConnection) {
    const sub = nc.subscribe("institution:deleted");
    for await (const data of sub) {
        const institution = data.json() as InstitutionDto;
        prisma.institution.delete({
            where: {
                id: institution.id
            }
        })
            .then((institution) => {
                logger.info("Institution deleted: " + institution.id);
            })
            .catch((e) => {
                logger.error("Error deleting institution: " + e);
            });
    }
}

export default function institutionListener(nc: nats.NatsConnection) {
    institutionCreatedListener(nc);
    institutionUpdatedListener(nc);
    institutionDeletedListener(nc);
}