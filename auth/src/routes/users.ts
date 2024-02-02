import express from "express";
import {authenticated} from "../middleware/authenticated";
import {UserDto, UserRequest} from "dtos";

const router = express.Router();

router.get(
    "/api/auth",
    authenticated,
    (req: UserRequest<UserDto>, res) => {
        res.send(req.user);
    });

export default router;