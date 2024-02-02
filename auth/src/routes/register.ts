import express from "express";
import {body, matchedData} from "express-validator";
import {nc, prisma} from "../utils/connections";
import bcrypt from "bcrypt";
import {validateRequest} from "../middleware/validateRequest";
import {logger} from "../utils/logger";

const router = express.Router();

router.post(
    "/api/auth/register",
    body("username")
        .custom(async username => {
            if (await prisma.user.count({ where: { username } }))
                throw new Error("Username already exists.");
        }),
    body("email")
        .isEmail().withMessage("Email must be valid.")
        .custom(async email => {
            if (await prisma.user.count({ where: { email } }))
                throw new Error("Email already exists.");
        })
        .normalizeEmail(),
    body("password")
        .trim()
        .isLength({ min: 8, max: 32 }).withMessage("Password must be between 8 and 32 characters."),
    validateRequest,
    (req, res) => {
        const { username, email, password } = matchedData(req);
        prisma.user.create({ data: {
                username, email,
                password: bcrypt.hashSync(password, 10)
        } })
            .then(user => {
                const publicUser = {
                    id: user.id,
                    username: user.username,
                    email: user.email
                };
                res.status(201).send(publicUser);
                nc.publish("auth:userCreated", JSON.stringify(publicUser));
                logger.info("Created user: " + JSON.stringify(publicUser));
            })
            .catch(err => {
                res.status(500).send(err);
                logger.error("Failed to create user: " + err);
            });
    });

export default router;