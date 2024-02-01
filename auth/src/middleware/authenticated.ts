import {UserDto, UserRequest} from "../utils/types";
import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import {constants} from "../utils/constants";

export function authenticated(req: UserRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.substring(7);
    if (!token)
        return res.status(401).send({errors: [{msg: "Unauthorized"}]});
    jwt.verify(token, constants.SECRET, (err, user) => {
        if (err || !user)
            return res.status(401).send({errors: [{msg: "Unauthorized"}]});

        if (typeof user === "string")
            req.user = JSON.parse(user) as UserDto;
        else
            req.user = user as UserDto;
        next();
    });
}