import express from "express";
import {prisma} from "../utils/objects";
import logger from "logger";
import {authenticate} from "middleware";
import {UserDto} from "types";
import {param, validationResult} from "express-validator";
import {institutionAccess, InstitutionRequest} from "../middleware/institutionAccess";

const router = express.Router();

router.get(
    "/:institutionId",
    param("institutionId").notEmpty().isInt({min: 1}),
    authenticate(prisma, logger),
    institutionAccess,
    async (req: InstitutionRequest<UserDto>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res
                .status(400)
                .json({ errors: errors.array() });

        const users = await prisma.usersOnInstitutions.findMany({
            where: { institutionId: req.institution!.id }
        });

        return res.send(users);
    });

export default router;