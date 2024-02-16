import express from "express";
import {authenticated} from "../middleware/authenticated";
import {UserDto, UserRequest} from "types";
import {prisma} from "../utils/connections";
import logger from "logger";
import {matchedData, query} from "express-validator";

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
                return res.status(500).send({
                    errors: [{
                        msg: "Internal server error"
                    }]
                });
            });
    });

router.get(
    "/api/auth/search",
    query("query").notEmpty().isLength({ min: 1, max: 255 }),
    (req, res) => {
        const { query } = matchedData(req);
        prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: "insensitive" } },
                    { firstName: { contains: query, mode: "insensitive" } },
                    { lastName: { contains: query, mode: "insensitive" } },
                ]
            }
        })
            .then(users => {
                res.json(users.map(user => ({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                })));
            })
            .catch(err => {
                logger.error("Error searching for users", err);
                res.status(500).send({
                    errors: [{
                        msg: "Internal server error"
                    }]
                });
            });
    });

export default router;