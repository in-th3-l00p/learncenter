import express from 'express';
import {body, matchedData, param} from "express-validator";
import {authenticate, validateRequest} from "middleware";
import logger from "logger";
import {prisma} from "../utils/objects";
import {UserRequest, handleServiceError} from "types";
import institutionService from "../services/InstitutionService";
import {UserDto} from "types/src/dtos";

const router = express.Router();

router.get(
    "/",
    authenticate(prisma, logger),
    async (req: UserRequest<UserDto>, res) => {
        try {
            res.send(await institutionService.getInstitutions(req.user!.id));
        } catch (err) {
            handleServiceError(res, err);
        }
    }
);

router.get(
    "/:id",
    param("id")
        .isLength({ max: 255 })
        .isNumeric()
        .notEmpty(),
    authenticate(prisma, logger),
    async (req: UserRequest<UserDto>, res) => {
        try {
            const { id } = matchedData(req);
            return res.send(await institutionService.getInstitution(
                parseInt(id), req.user!.id
            ));
        } catch (err: any) {
            handleServiceError(res, err);
        }
    });

router.post(
    "/",
    authenticate(prisma, logger),
    body("name")
        .notEmpty()
        .isLength({ max: 255 }),
    body("description")
        .notEmpty()
        .isLength({ max: 255 }),
    validateRequest,
    async (req: UserRequest<UserDto>, res) => {
        const {name, description} = req.body;
        res.send(await institutionService
            .createInstitution(name, description, req.user!.id)
        );
    });

router.put(
    "/:id",
    authenticate(prisma, logger),
    param("id")
        .notEmpty()
        .isLength({ max: 255 }),
    body("name")
        .notEmpty()
        .isLength({ max: 255 }),
    body("description")
        .notEmpty()
        .isLength({ max: 255 }),
    validateRequest,
    async (req: UserRequest<UserDto>, res) => {
        try {
            const {id, name, description} = matchedData(req);
            res.send(await institutionService
                .updateInstitution(
                    parseInt(id), name, description, req.user!.id
                ));
        } catch (err: any) {
            handleServiceError(res, err);
        }
    });

router.delete(
    "/:id",
    param("id")
        .notEmpty()
        .isLength({ max: 255 }),
    authenticate(prisma, logger),
    async (req: UserRequest<UserDto>, res) => {
        try {
            const {id} = matchedData(req);
            await institutionService.deleteInstitution(
                parseInt(id), req.user!.id
            );
            res.send({msg: "Institution deleted"});
        } catch (err: any) {
            handleServiceError(res, err);
        }
    });

export default router;
