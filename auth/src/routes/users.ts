import express from "express";
import {authenticated} from "../utils/middleware";
import {UserRequest} from "../utils/types";

const router = express.Router();

router.get(
    "/api/auth",
    authenticated,
    (req: UserRequest, res) => {
        res.send(req.user);
    });

export default router;