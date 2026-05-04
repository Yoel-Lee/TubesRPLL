import express from "express";
import { createDenda, getDendaByUser } from "../controllers/dendaController.js";

const router = express.Router();

router.post("/", createDenda);
router.get("/", getDendaByUser);

export const dendaRoutes = router;