import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares";
import {
  getInfoMahasiswaByEmail,
  getInfoSetoranMahasiswaByNIM,
  getAllSetoranMahasiswaByNIM,
} from "../controllers/mahasiswa.controllers";
import { authorizeRoles } from "../middlewares/protected.middlewares";

const router = express.Router();

router.get(
  "/mahasiswa/info/:email",
  accessTokenValidation,
  authorizeRoles("mahasiswa"),
  getInfoMahasiswaByEmail
);
router.get(
  "/mahasiswa/setoran/:nim",
  accessTokenValidation,
  authorizeRoles("mahasiswa", "dosen-pa"),
  getAllSetoranMahasiswaByNIM
);
router.get(
  "/mahasiswa/setoran/info/:nim",
  accessTokenValidation,
  authorizeRoles("mahasiswa", "dosen-pa"),
  getInfoSetoranMahasiswaByNIM
);

export default router;
