import express from "express";
import { prisma } from "../utils/objects";

const router = express.Router();

router.get("/", (req, res) => {
    prisma.package.findMany()
        .then((packages) => res.send(packages))
        .catch(() => res
            .status(500)
            .send({ error: "Internal server error" })
        );
});

export default router;