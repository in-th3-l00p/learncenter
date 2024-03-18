import {Response, NextFunction} from "express";
import {UserRequest} from "types";
import {prisma} from "../utils/objects";
import {Prisma} from "@prisma/client";
import {UserDto} from "types/src/dtos";

export interface InstitutionRequest<T> extends UserRequest<T> {
    institution?: Prisma.InstitutionGetPayload<{}>;
    role?: "ADMIN" | "USER";
}

export async function institutionNoAccess(
    req: InstitutionRequest<UserDto>,
    res: Response,
    next: NextFunction
) {
    const { institutionId } = req.params;
    const institution = await prisma.institution.findUnique({
        where: { id: parseInt(institutionId) }
    });
    if (!institution) {
        return res.status(404).send({
            errors: [{
                msg: "Institution not found"
            }]
        });
    }

    const { user } = req;
    if (!user)
        return res.status(401).send({
            errors: [{
                msg: "Unauthorized"
            }]
        });

    if (await prisma.usersOnInstitutions.count({
        where: {
            institutionId: institution.id,
            userId: user.id
        }
    }) === 0) {
        return res.status(403).send({
            errors: [{
                msg: "You are not a member of this institution"
            }]
        });
    }

    req.institution = institution;
    next();
}

export async function institutionAccess(
    req: InstitutionRequest<UserDto>,
    res: Response,
    next: NextFunction
) {
    const { institutionId } = req.params;
    const institution = await prisma.institution.findUnique({
        where: { id: parseInt(institutionId) }
    });
    const { user } = req;
    if (!institution) {
        return res.status(404).send({
            errors: [{
                msg: "Institution not found"
            }]
        });
    }
    if (!user)
        return res.status(401).send({
            errors: [{
                msg: "Unauthorized"
            }]
        });

    const roleWrapper = await prisma.usersOnInstitutions.findFirst({
        where: {
            institutionId: institution.id,
            userId: user.id
        },
        select: {
            role: true
        }
    });
    if (
        !roleWrapper ||
        roleWrapper.role === "PENDING" ||
        roleWrapper.role === "BANNED" ||
        roleWrapper.role === "DELETED"
    ) {
        return res.status(403).send({
            errors: [{
                msg: "You are not a member of this institution"
            }]
        });
    }

    req.institution = institution;
    req.role = roleWrapper.role;
    next();
}
export async function institutionAdminAccess(
    req: InstitutionRequest<UserDto>,
    res: Response,
    next: NextFunction
) {
    await institutionAccess(req, res, async () => {
        const { role } = req;
        if (role !== "ADMIN")
            return res.status(403).send({
                errors: [{
                    msg: "You are not an admin of this institution"
                }]
            });

        next();
    });
}
