import { Request, Response, NextFunction } from "express";
import {validationResult} from "express-validator";
import jwt from "jsonwebtoken";
import {constants} from "./constants";
import {UserDto, UserRequest} from "./types";

export function validateRequest(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).send(errors.array());
    next();
}

export function authenticated(req: UserRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.substring(7);
    if (!token)
        return res.status(401).send({ errors: [{ msg: "Unauthorized" }] });
    jwt.verify(token, constants.SECRET, (err, user) => {
        if (err || !user)
            return res.status(401).send({ errors: [{ msg: "Unauthorized" }] });

        if (typeof user === "string")
            req.user = JSON.parse(user) as UserDto;
        else
            req.user = user as UserDto;
        next();
    });
}