import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares";
import { findMahasiswaByNameOrNim, getInfoMahasiswaPAPerAngkatanByNIP, postSetoran } from "../controllers/dosen.controllers";
import { dosenPaOnly } from "../middlewares/protected.middlewares";

const router = express.Router();

router.get("/dosen/mahasiswa/angkatan/info/:nip", accessTokenValidation, dosenPaOnly, getInfoMahasiswaPAPerAngkatanByNIP);
router.get("/dosen/mahasiswa", accessTokenValidation, dosenPaOnly, findMahasiswaByNameOrNim);
router.post("/dosen/mahasiswa", accessTokenValidation, dosenPaOnly, postSetoran);

export default router;

