import express from "express";
import { getStat, getFormSurah } from "../controllers/mahasiswa.controllers";
import accessTokenValidation from "../middlewares/auth.middlewares";

const router = express.Router();

router.get("/stat", accessTokenValidation, getStat);
router.get("/setoran", accessTokenValidation, getFormSurah);

export default router;
