import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares";
import { getInfoMahasiswaByEmail, getInfoSetoranMahasiswaByNIM, getSetoranMahasiswaByNIM } from "../controllers/mahasiswa.controllers";
import { authorizeRoles } from "../middlewares/protected.middlewares";

const router = express.Router();

router.get("/mahasiswa/info/:email", accessTokenValidation, authorizeRoles("mahasiswa"), getInfoMahasiswaByEmail);
router.get("/mahasiswa/setoran/:nim", accessTokenValidation, authorizeRoles("mahasiswa", "dosen-pa"), getSetoranMahasiswaByNIM);
router.get("/mahasiswa/setoran/info/:nim", accessTokenValidation, authorizeRoles("mahasiswa"), getInfoSetoranMahasiswaByNIM);

export default router;