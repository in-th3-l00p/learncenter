import {NatsConnection} from "nats";
import {PackageDto} from "types";
import {prisma} from "../utils/objects";
import logger from "logger";

export default async function paymentsInstitutionUpdateListener(nc: NatsConnection) {
    const sub = nc.subscribe("payments:institutionUpdated");
    for await (const message of sub) {
        const data: { institutionId: number; package: PackageDto } = message.json();
        const institutionId = data.institutionId;
        const selectedPackage = data.package;

        const update = await prisma.pendingUpdate.create({
            data: {
                newClassroomsAmount: selectedPackage.newClassroomsAmount,
                newUsersAmount: selectedPackage.newUsersAmount
            }
        });

        await prisma.institution.update({
            where: { id: institutionId },
            data: { pendingUpdateId: update.id }
        });

        logger.info(`Institution ${institutionId} received a new package: ${selectedPackage.name}.`);
    }
}