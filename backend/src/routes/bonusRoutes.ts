import express from "express";
import { createBonus, getBonusByUser } from "../controllers/bonusController.js";

const router = express.Router();

router.post("/", createBonus);
router.get("/", getBonusByUser);

export const bonusRoutes = router;