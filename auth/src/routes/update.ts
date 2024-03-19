import express from "express";
import {authenticated} from "../middleware/authenticated";
import {UserRequest} from "types";
import {UserDto} from "types/src/dtos";
import {body, matchedData} from "express-validator";
import {prisma} from "../utils/connections";
import UserService from "../services/UserService";
import {validateRequest} from "middleware";
import {handleServiceError} from "types";

const router = express.Router();

router.put(
    "/api/auth/update",
    body("username")
        .notEmpty()
        .custom(async username => {
            if (await prisma.user.count({ where: { username } }))
                throw new Error("Username already exists.");
        })
        .isLength({ max: 255 }),
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
    authenticated,
    (req: UserRequest<UserDto>, res) => {
        const { username, firstName, lastName, phone } = matchedData(req);
        UserService.updateUser(
            req.user?.id!,
            username,
            firstName,
            lastName,
            phone
        )
            .then(() => res.status(200).end())
            .catch(err => handleServiceError(res, err));
    });

router.put(
    "/api/auth/password",
    body("currentPassword").isLength({ min: 8, max: 32 }),
    body("password")
        .trim()
        .isLength({ min: 8, max: 32 })
        .withMessage("Password must be between 8 and 32 characters."),
    validateRequest,
    authenticated,
    (req: UserRequest<UserDto>, res) => {
        const { currentPassword, password } = matchedData(req);
        UserService
            .changePassword(req.user?.id!, currentPassword, password)
            .then(() => res.status(200).end())
            .catch(err => handleServiceError(res, err));
    })

export default router;