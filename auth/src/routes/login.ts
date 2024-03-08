import express from "express";
import {body, matchedData} from "express-validator";
import {prisma} from "../utils/connections";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {constants} from "../utils/constants";
import { validateRequest } from "middleware";
import logger from "logger";

const router = express.Router();

router.post("/api/auth/login",
    body("email")
        .isEmail()
        .withMessage("Email must be valid")
        .isLength({ max: 255 }),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("You must supply a password")
        .isLength({ min: 8, max: 255 }),
    validateRequest,
    async (req, res) => {
        const { email, password } = matchedData(req);
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user || !bcrypt.compareSync(password, user.password))
            return res
                .status(400)
                .send({ errors: [{ msg: "Invalid credentials" }] });

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        };

        jwt.sign(
            payload,
            constants.SECRET,
            {
                expiresIn: constants.JWT_EXPIRE ,
                algorithm: "HS256" // debug only
            },
            (err, token) => {
                if (err) {
                    logger.error("Failed to sign JWT: " + err);
                    return res
                        .status(500)
                        .send({errors: [{msg: "Internal server error"}]});
                }

                res.send({ token });
            }
        );
    });

export default router;