import express from "express";
import {prisma} from "../utils/objects";
import logger from "logger";
import {authenticate} from "middleware";
import {handleServiceError, UserDto, UserRequest} from "types";
import {matchedData, param, query, validationResult} from "express-validator";
import {
    institutionAccess,
    institutionAdminAccess,
    institutionNoAccess,
    InstitutionRequest
} from "../middleware/institutionAccess";
import {UserRole} from "@prisma/client";
import institutionService from "../services/InstitutionService";

const router = express.Router();

router.get(
    "/",
    authenticate(prisma, logger),
    (req: UserRequest<UserDto>, res) => {
        const { role } = req.query;

        prisma.usersOnInstitutions.findMany({
            where: {
                userId: req.user!.id,
                role: (
                    role &&
                    typeof role === "string" &&
                    role in UserRole
                )   ? role as UserRole
                    : undefined
            },
            include: {
                institution: true
            }
        })
            .then(users => {
                res.send(users);
            })
            .catch(err => {
                logger.error("Error getting user institutions", err);
                res.status(500).send({
                    errors: [{
                        msg: "Internal server error"
                    }]
                });
            });
    });

router.get(
    "/:institutionId",
    param("institutionId").notEmpty().isInt({min: 1}),
    authenticate(prisma, logger),
    institutionAccess,
    async (req: InstitutionRequest<UserDto>, res) => {
        const users = await prisma.usersOnInstitutions.findMany({
            where: { institutionId: req.institution!.id },
            include: { user: true, institution: true }
        });

        return res.send(users.map(user => ({
            id: user.id,
            user: user.user,
            institutionId: user.institutionId,
            role: user.role,
            createdAt: user.createdAt
        })));
    });

router.post(
    "/:institutionId",
    param("institutionId").notEmpty().isInt({min: 1}),
    query("userId").notEmpty().isInt(),
    authenticate(prisma, logger),
    institutionAdminAccess,
    async (req: InstitutionRequest<UserDto>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).send(errors);

        const data = matchedData(req);
        const userId = parseInt(data.userId);
        const institutionId = parseInt(req.params.institutionId);
        try {
            await institutionService.inviteUser(institutionId, userId);
            res.send({
                msg: "User invited to institution"
            });
        } catch (err) {
            handleServiceError(res, err);
        }
    });

router.post(
    "/accept/:institutionId",
    authenticate(prisma, logger),
    institutionNoAccess,
    (req: InstitutionRequest<UserDto>, res) => {
        const { institution } = req;
        const { user } = req;
        prisma.usersOnInstitutions.updateMany({
            where: {
                institutionId: institution!.id,
                userId: user!.id,
                role: "PENDING"
            },
            data: {
                role: "USER"
            }
        })
            .then(relation => {
                if (relation.count === 0)
                    return res.status(404).send({
                        errors: [{
                            msg: "Invitation not found"
                        }]
                    });
                logger.info(`User accepted institution ${institution!.id} invite.`);
                res.send({
                    msg: "User accepted into institution"
                });
            })
            .catch(err => {
                logger.error("Error accepting user into institution", err);
                res.status(500).send({
                    errors: [{
                        msg: "Internal server error"
                    }]
                });
            });
    });

router.delete(
    "/:institutionId",
    query("userId").notEmpty().isInt(),
    authenticate(prisma, logger),
    institutionAdminAccess,
    async (req: InstitutionRequest<UserDto>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).send(errors);

        const { institution } = req;
        const { userId } = matchedData(req);
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });
        if (!user)
            return res.status(404).send({
                errors: [{
                    msg: "User not found"
                }]
            });

        const relation = await prisma.usersOnInstitutions.findFirst({
            where: {
                institutionId: institution!.id,
                userId: user.id
            }
        });
        if (!relation)
            return res.status(404).send({
                errors: [{
                    msg: "User not found in institution"
                }]
            });

        prisma.usersOnInstitutions.delete({
            where: { id: relation.id }
        })
            .then(relation => {
                if (!relation)
                    return res.status(404).send({
                        errors: [{
                            msg: "User not found in institution"
                        }]
                    });
                logger.info(`User removed from institution: ${JSON.stringify(relation)}.`);
                res.send({
                    msg: "User removed from institution"
                });
            })
            .catch(err => {
                logger.error("Error removing user from institution", err);
                res.status(500).send({
                    errors: [{
                        msg: "Internal server error"
                    }]
                });
            });
    });

export default router;