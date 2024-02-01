import express from "express";
import {UserRequest} from "../utils/types";
import {authenticated} from "../middleware/authenticated";

const router = express.Router();

router.get(
    "/api/auth",
    authenticated,
    (req: UserRequest, res) => {
        res.send(req.user);
    });

export default router;