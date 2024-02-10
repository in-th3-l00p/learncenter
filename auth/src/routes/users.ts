import express from "express";
import {authenticated} from "../middleware/authenticated";
import {UserDto, UserRequest} from "dtos";
import {prisma} from "../utils/connections";
import logger from "logger";

const router = express.Router();

router.get(
    "/api/auth",
    authenticated,
    (req: UserRequest<UserDto>, res) => {
        prisma.user.findUnique({ where: { id: req.user?.id } })
            .then(user => {
                if (!user) {
                    res.status(404).send({
                        errors: [{
                            msg: "User not found"
                        }]
                    });
                }

                res.json({
                    id: user!.id,
                    username: user!.username,
                    email: user!.email,
                    firstName: user!.firstName,
                    lastName: user!.lastName,
                    phone: user!.phone,
                    createdAt: user!.createdAt
                });
            })
            .catch(err => {
                logger.error("Error getting user", err);
                res.status(500).send({
                    errors: [{
                        msg: "Internal server error"
                    }]
                });
            });
    });

export default router;