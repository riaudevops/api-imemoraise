import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares";
import { findMahasiswaByNameOrNim, getAllMahasiswaPAByAngkatan, getInfoMahasiswaPAPerAngkatanByNIP } from "../controllers/dosen.controllers";
import { dosenPaOnly } from "../middlewares/protected.middlewares";

const router = express.Router();

router.get("/dosen/mahasiswa/angkatan/info/:nip", accessTokenValidation, dosenPaOnly, getInfoMahasiswaPAPerAngkatanByNIP);
router.get("/dosen/mahasiswa/:nip/:angkatan", accessTokenValidation, dosenPaOnly, getAllMahasiswaPAByAngkatan);
router.get("/dosen/mahasiswa/find/:nip/:angkatan/:nama/:nim", accessTokenValidation, dosenPaOnly, findMahasiswaByNameOrNim);

export default router;

