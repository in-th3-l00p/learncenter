import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {UserRequest} from "../../types";
import axios, {AxiosError} from "axios";
import {PrismaClient} from "prisma/prisma-client/scripts/default-index";
import {Logger} from "winston";

export function validateRequest(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).send(errors.array());
    next();
}

export function authenticate<T>(
    prisma: PrismaClient, logger: Logger
) {
    return async (req: UserRequest<T>, res: Response, next: NextFunction) => {
        try {
            const userDto = await axios.get(process.env.AUTH_URL! + "/api/auth", {
                headers: {Authorization: req.headers.authorization}
            });

            const user = await prisma.user.findUnique({
                where: {id: userDto.data.id}
            });
            if (!user)
                return res.status(401).send({
                    errors: [{
                        msg: "Unauthorized"
                    }]
                });

            req.user = user;
            next();
        } catch (err) {
            if (err instanceof AxiosError && err.response?.status === 401) {
                return res.status(401).send({
                    errors: [{
                        msg: "Unauthorized"
                    }]
                });
            }

            logger.error("Error in authenticate middleware: " + err);
            return res.status(500).send({
                errors: [{
                    msg: "Internal Server Error"
                }]
            });
        }
    }
}
