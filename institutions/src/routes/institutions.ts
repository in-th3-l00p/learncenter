import express from 'express';
import {body} from "express-validator";
import {authenticate, validateRequest} from "middleware";
import logger from "logger";
import {prisma} from "../utils/objects";
import {UserDto, UserRequest} from "dtos";
import {nc} from "../events/nats";

const router = express.Router();

router.get(
    "/",
    authenticate(prisma, logger),
    (req: UserRequest<UserDto>, res) => {
        prisma.institution.findMany({
            where: {
                userId: req.user!.id
            }
        })
            .then(institutions => res.json(institutions))
            .catch(err => {
                logger.error(err);
                res.status(500).end();
            });
    }
);

router.get(
    "/:id",
    authenticate(prisma, logger),
    (req: UserRequest<UserDto>, res) => {
        prisma.institution.findUnique({
            where: {
                id: parseInt(req.params.id),
                userId: req.user!.id
            }
        })
            .then(institution => {
                if (!institution)
                    return res.status(404).end();
                res.json(institution);
            })
            .catch(err => {
                logger.error(err);
                res.status(500).end();
            });
    });

router.post(
    "/",
    authenticate(prisma, logger),
    body("name").notEmpty(),
    body("description").notEmpty(),
    validateRequest,
    (req: UserRequest<UserDto>, res) => {
        const {name, description} = req.body;
        prisma.institution.create({
            data: {
                name,
                description,
                user: {
                    connect: {
                        id: req.user!.id
                    }
                }
            }
        })
            .then(institution => {
                nc.publish("institution:created", JSON.stringify(institution));
                res.status(201).json(institution)
            })
            .catch(err => {
                logger.error(err);
                res.status(500).end();
            });
    });

router.put(
    "/:id",
    authenticate(prisma, logger),
    body("name").notEmpty(),
    body("description").notEmpty(),
    validateRequest,
    (req: UserRequest<UserDto>, res) => {
        const {name, description} = req.body;
        prisma.institution.update({
            where: {
                id: parseInt(req.params.id),
                userId: req.user!.id
            },
            data: {
                name,
                description
            }
        })
            .then(institution => {
                if (!institution)
                    return res.status(404).end();
                nc.publish("institution:updated", JSON.stringify(institution));
                res.json(institution);
            })
            .catch(err => {
                logger.error(err);
                res.status(500).end();
            });
    });

router.delete(
    "/:id",
    authenticate(prisma, logger),
    (req: UserRequest<UserDto>, res) => {
        prisma.institution.delete({
            where: {
                id: parseInt(req.params.id),
                userId: req.user!.id
            }
        })
            .then(() => {
                nc.publish("institution:deleted", JSON.stringify({
                    id: parseInt(req.params.id)
                }));
                res.status(204).end();
            })
            .catch(err => {
                logger.error(err);
                res.status(500).end();
            });
    });

export default router;
