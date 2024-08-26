import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const postAkun = async (req: Request, res: Response) => {
  const { email, nama } = req.body;

  try {
    // Mengecek apakah sebelumnya ada akun dengan email yang sama
    const checkAkun = await prisma.akun.findFirst({
      where: {
        email: email,
      },
    });
    if (checkAkun) {
      return res.status(400).json({
        response: false,
        message: "Akun dengan email tersebut sudah ada!",
      });
    }

    // Jika belum ada, akun akan didaftarkan
    const result = await prisma.akun.create({
      data: {
        email: email,
        nama: nama,
      },
    });
    res.status(200).json({
      response: true,
      message: "Akun Berhasil di-daftarkan!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      response: false,
      message: "Oops! ada kesalahan di server kami 😭",
    });
  }
};

export { postAkun };
