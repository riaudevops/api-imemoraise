import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares";
import { getInfoMahasiswaByEmail, getInfoSetoranMahasiswaByNIM, getSurahMahasiswaByNIM } from "../controllers/mahasiswa.controllers";
import { mahasiswaOnly } from "../middlewares/protected.middlewares";

const router = express.Router();

router.get("/mahasiswa/setoran/info/:nim", accessTokenValidation, mahasiswaOnly, getInfoSetoranMahasiswaByNIM);
router.get("/mahasiswa/info/:email", accessTokenValidation, mahasiswaOnly, getInfoMahasiswaByEmail);
router.get("/mahasiswa/surah/:nim", accessTokenValidation, mahasiswaOnly, getSurahMahasiswaByNIM);

export default router;
