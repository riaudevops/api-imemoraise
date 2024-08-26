import express from "express";
import { postAkun } from "../controllers/auth.controller";

const router = express.Router();

router.post("/akun", postAkun);

export default router;
