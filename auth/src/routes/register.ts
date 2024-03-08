import express from "express";
import {body, matchedData} from "express-validator";
import {prisma} from "../utils/connections";
import bcrypt from "bcrypt";
import {validateRequest} from "middleware";
import logger from "logger";
import Amqp from "streaming";
import {EventType} from "streaming/src/event";

const router = express.Router();

router.post(
    "/api/auth/register",
    body("username")
        .custom(async username => {
            if (await prisma.user.count({ where: { username } }))
                throw new Error("Username already exists.");
        })
        .isLength({ max: 255 }),
    body("email")
        .isEmail().withMessage("Email must be valid.")
        .custom(async email => {
            if (await prisma.user.count({ where: { email } }))
                throw new Error("Email already exists.");
        })
        .normalizeEmail()
        .isLength({ max: 255}),
    body("password")
        .trim()
        .isLength({ min: 8, max: 32 })
        .withMessage("Password must be between 8 and 32 characters."),
    body("firstName")
        .isString()
        .isLength({ max: 255 }),
    body("lastName")
        .isString()
        .isLength({ max: 255 }),
    body("phone")
        .isString()
        .isMobilePhone("any", { strictMode: false })
        .isLength({ max: 255 }),
    validateRequest,
    (req, res) => {
        const {username, email, password, firstName, lastName, phone} = matchedData(req);
        prisma.user.create({ data: {
            username, email, phone, firstName, lastName,
            password: bcrypt.hashSync(password, 10)
        } })
            .then(user => {
                const publicUser = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone
                };
                res.status(201).send(publicUser);
                logger.info("Created user: " + JSON.stringify(publicUser));

                Amqp.getInstance().publish({
                    type: EventType.USER_CREATED,
                    data: publicUser
                })
            })
            .catch(err => {
                res.status(500).send(err);
                logger.error("Failed to create user: " + err);
            });
    });

export default router;