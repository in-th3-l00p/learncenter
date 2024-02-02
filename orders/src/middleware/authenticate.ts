import {Response, NextFunction} from "express";
import axios, {AxiosError} from "axios";
import {logger} from "../utils/logger";
import {UserRequest} from "../utils/types";
import {prisma} from "../utils/objects";

export default async function authenticate(
    req: UserRequest, res: Response, next: NextFunction
) {
    try {
        const userDto = await axios.get(process.env.AUTH_URL! + "/api/auth", {
            headers: {Authorization: req.headers.authorization}
        });

        const user = await prisma.user.findUnique({
            where: {id: userDto.data.id}
        });
        if (!user)
            return res.status(401).send("Unauthorized");

        req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            customerId: user.customerId
        };
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