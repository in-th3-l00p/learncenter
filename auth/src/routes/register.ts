import express from "express";
import {body, matchedData} from "express-validator";
import {prisma} from "../utils/connections";
import {validateRequest} from "middleware";
import UserService from "../services/UserService";
import {handleServiceError} from "types";
import {userToPublicUserDto} from "types/src/dtos";

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
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            phone
        } = matchedData(req);
        UserService
            .createUser(
                username,
                email,
                password,
                firstName,
                lastName,
                phone
            )
            .then(user => {
                res.send(userToPublicUserDto(user));
            })
            .catch(err => handleServiceError(res, err));
    });

export default router;