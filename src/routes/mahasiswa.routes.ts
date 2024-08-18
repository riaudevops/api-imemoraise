import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares";
import { getInfoMahasiswaByEmail, getInfoSetoranMahasiswaByNIM, getSurahMahasiswaByNIM } from "../controllers/mahasiswa.controllers";
import { authorizeRoles } from "../middlewares/protected.middlewares";

const router = express.Router();

router.get("/mahasiswa/setoran/info/:nim", accessTokenValidation, authorizeRoles("mahasiswa"), getInfoSetoranMahasiswaByNIM);
router.get("/mahasiswa/info/:email", accessTokenValidation, authorizeRoles("mahasiswa"), getInfoMahasiswaByEmail);
router.get("/mahasiswa/surah/:nim", accessTokenValidation, authorizeRoles("mahasiswa", "dosen-pa"), getSurahMahasiswaByNIM);

export default router;