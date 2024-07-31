import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares";
import { getAllMahasiswaPA, getMahasiswaPAByNIM } from "../controllers/dosen.controllers";

const router = express.Router();

router.get("/mahasiswa-pa", accessTokenValidation, getAllMahasiswaPA);
router.get("/mahasiswa-pa/:nim", accessTokenValidation, getMahasiswaPAByNIM);

export default router;

