import {Response, NextFunction} from "express";
import {UserDto, UserRequest} from "types";
import {prisma} from "../utils/objects";
import {Prisma} from "@prisma/client";

export interface InstitutionRequest<T> extends UserRequest<T> {
    institution?: Prisma.InstitutionGetPayload<{}>;
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
export async function institutionAdminAccess(
    req: InstitutionRequest<UserDto>,
    res: Response,
    next: NextFunction
) {
    await institutionAccess(req, res, async () => {
        const { user, institution } = req;
        if (!user)
            return res.status(401).send({
                errors: [{
                    msg: "Unauthorized"
                }]
            });

        if (await prisma.usersOnInstitutions.count({
            where: {
                institutionId: institution!.id,
                userId: user.id,
                role: "ADMIN"
            }
        }) === 0) {
            return res.status(403).send({
                errors: [{
                    msg: "You are not an admin of this institution"
                }]
            });
        }

        next();
    });
}
