import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares";
import { findMahasiswaByNameOrNim, getInfoDosenByEmail, getInfoMahasiswaPAPerAngkatanByNIP, postSetoran } from "../controllers/dosen.controllers";
import { authorizeRoles } from "../middlewares/protected.middlewares";

const router = express.Router();

router.get("/dosen/info/:email", accessTokenValidation, authorizeRoles("dosen-pa"), getInfoDosenByEmail);
router.get("/dosen/mahasiswa/angkatan/info/:nip", accessTokenValidation, authorizeRoles("dosen-pa"), getInfoMahasiswaPAPerAngkatanByNIP);
router.get("/dosen/mahasiswa", accessTokenValidation, authorizeRoles("dosen-pa"), findMahasiswaByNameOrNim);
router.post("/dosen/mahasiswa", accessTokenValidation, authorizeRoles("dosen-pa"), postSetoran);

export default router;

