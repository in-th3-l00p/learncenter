import express from "express";
import {prisma} from "../utils/objects";
import logger from "logger";
import {authenticate} from "middleware";
import {UserDto, UserRequest} from "types";
import {param, validationResult} from "express-validator";

const router = express.Router();

router.get(
    "/:institutionId",
    param("institutionId").notEmpty().isInt({min: 1}),
    authenticate(prisma, logger),
    async (req: UserRequest<UserDto>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res
                .status(400)
                .json({ errors: errors.array() });

        const user = req.user;
        const institution = await prisma.institution.findUnique({
            where: { id: parseInt(req.params.institutionId) }
        });
        if (!institution)
            return res
                .status(404)
                .json({ errors: ["Institution not found"] });

        const userRole = await prisma.usersOnInstitutions.findFirst({
            where: {
                userId: user!.id,
                institutionId: institution.id
            },
            select: {
                role: true
            }
        });
        if (userRole?.role !== "ADMIN")
            return res
                .status(403)
                .json({ errors: ["You are not allowed to access this resource"] });


        const users = await prisma.usersOnInstitutions.findMany({
            where: { institutionId: institution.id }
        });

        return res.send(users);
    });

export default router;