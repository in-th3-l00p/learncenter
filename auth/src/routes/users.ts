import express from "express";
import {authenticated} from "../middleware/authenticated";
import {handleServiceError, UserRequest} from "types";
import {query} from "express-validator";
import {UserDto, userToPublicUserDto} from "types/src/dtos";
import UserService from "../services/UserService";

const router = express.Router();

router.get(
    "/api/auth",
    authenticated,
    (req: UserRequest<UserDto>, res) => {
        if (!req.user)
            return res.status(401).send({
                errors: [{
                    msg: "Unauthorized"
                }]
            });
        UserService.getUserById(req.user.id)
            .then(user => res.send(user))
            .catch(err => handleServiceError(res, err))
    });

router.get(
    "/api/auth/search",
    query("query").notEmpty().isLength({ min: 1, max: 255 }),
    (req, res) => {
        UserService.searchUsers(req.query!.query)
            .then(users => res.send(users.map(userToPublicUserDto)))
            .catch(err => handleServiceError(res, err));
    });

export default router;