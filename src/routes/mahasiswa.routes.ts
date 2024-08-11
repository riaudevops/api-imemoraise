import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares";
import { getStat, getFormSurah } from "../controllers/mahasiswa.controllers";

const router = express.Router();

router.get("/stat", accessTokenValidation, getStat);
router.get("/setoran", accessTokenValidation, getFormSurah);

export default router;
