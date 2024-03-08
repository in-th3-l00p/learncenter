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
import userInstitutionService from "../services/UserInstitutionService";

const router = express.Router();

router.get(
    "/",
    authenticate(prisma, logger),
    async (req: UserRequest<UserDto>, res) => {
        try {
            const {role} = req.query;
            res.send(await userInstitutionService.getUsers(
                undefined,
                req.user!.id,
                typeof role === "string" ? role as UserRole : undefined
            ));
        } catch (err) {
            logger.error("Error getting user institutions", err);
            handleServiceError(res, err);
        }
    });

router.get(
    "/:institutionId",
    param("institutionId").notEmpty().isInt({min: 1}),
    query("userId").optional(),
    authenticate(prisma, logger),
    institutionAccess,
    async (req: InstitutionRequest<UserDto>, res) => {
        try {
            res.send(await userInstitutionService.getUsers(
                req.institution!.id,
                typeof req.query.userId === "string" ?
                    parseInt(req.query.userId) :
                    undefined
            ));
        } catch (err) {
            logger.error("Error getting users from institution", err);
            handleServiceError(res, err);
        }
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
            await userInstitutionService.inviteUser(institutionId, userId);
            res.send({
                msg: "User invited to institution"
            });
        } catch (err) {
            logger.error("Error inviting user to institution", err);
            handleServiceError(res, err);
        }
    });

router.post(
    "/accept/:institutionId",
    authenticate(prisma, logger),
    institutionNoAccess,
    async (req: InstitutionRequest<UserDto>, res) => {
        const { institution } = req;
        const { user } = req;
        try {
            await userInstitutionService.acceptUser(
                institution!.id, user!.id
            );
            res.send({
                msg: "User accepted into institution"
            });
        } catch (err) {
            logger.error("Error accepting user into institution", err);
            handleServiceError(res, err);
        }
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
        const data = matchedData(req);
        const userId = parseInt(data["userId"]);
        try {
            await userInstitutionService.removeUser(institution!.id, userId);
            res.send({
                msg: "User removed from institution"
            });
        } catch (err) {
            logger.error("Error removing user from institution", err);
            handleServiceError(res, err);
        }
    });

export default router;