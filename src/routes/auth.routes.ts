import express from "express";
import { postAkun } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/akun", postAkun);

export default router;
