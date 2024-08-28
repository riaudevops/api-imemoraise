import { PrismaClient } from "@prisma/client";
import {
  getAllInfoSetoranByNip,
  getInfoMahasiswaPAPerAngkatanByNIP,
  IDGenerator,
} from "../services/dosen.services.js";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getInfoDosenByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    // Mengambil data nama, dan nim mahasiswa berdasarkan email
    const resultInfoPribadiDosen = await prisma.dosen.findFirst({
      where: {
        email: email,
      },
      select: {
        nama: true,
        nip: true,
      },
    });

    const resultInfoMahasiswaPerAngkatan =
      await getInfoMahasiswaPAPerAngkatanByNIP(resultInfoPribadiDosen!.nip);

    const statsSetoran = await getAllInfoSetoranByNip(
      resultInfoPribadiDosen!.nip
    );

    res.status(200).json({
      response: true,
      message:
        "Berikut info dosen lengkap serta info mahasiswa per angkatan (max 8 akt)!",
      data: {
        nama: resultInfoPribadiDosen!.nama,
        nip: resultInfoPribadiDosen!.nip,
        info: resultInfoMahasiswaPerAngkatan,
        stats: {
          list_setoran_perhari: statsSetoran,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response: false,
      message: "Internal server error!",
    });
  }
};

const postSetoran = async (req: Request, res: Response) => {
  const { nim, nip, nomor_surah, tgl_setoran } = req.body;

  // Validasi input
  if (!nim || !nip || !nomor_surah) {
    return res.status(400).json({
      response: false,
      message: "Waduh, lengkapi dulu datanya mas!",
    });
  }

  // Convert nomor_surah to integer if it is a string, and returns err if not
  const nomorSurahInt = parseInt(nomor_surah as string, 10);
  if (isNaN(nomorSurahInt)) {
    return res.status(400).json({
      response: false,
      message: "Waduh, nomor surah-nya salah format mas!",
    });
  }

  await prisma.$transaction(async (prisma) => {
    try {
      // Periksa apakah kombinasi nim, nip, dan nomor_surah sudah ada (antisipasi duplikasi setoran di 1 mhs)
      const existingSetoran = await prisma.setoran.findFirst({
        where: {
          AND: [
            { nim: nim as string },
            { nip: nip as string },
            { nomor_surah: nomorSurahInt },
          ],
        },
      });
      if (existingSetoran) {
        return res.status(400).json({
          response: false,
          message: "Maaf, mahasiswa ybs telah menyetor surah tersebut!",
        });
      }

      // Generate ID setoran baru, format SH240001 ++
      const idSetoran = await IDGenerator.generateNewIdSetoran();

      // Simpan data ke database mas
      await prisma.setoran.create({
        data: {
          id: idSetoran,
          tgl_setoran: tgl_setoran ? new Date(tgl_setoran) : new Date(),
          tgl_validasi: new Date(),
          nim: nim as string,
          nip: nip as string,
          nomor_surah: nomorSurahInt,
        },
      });

      // Kirim respons sukses
      res.status(201).json({
        response: true,
        message: "Yeay, proses validasi setoran berhasil! ✨",
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Oops! ada kesalahan di server kami 😭",
      });
    }
  });
};

const deleteSetoranByID = async (req: Request, res: Response) => {
  const { id_setoran } = req.params;

  // Validasi input
  if (!id_setoran) {
    return res.status(400).json({
      response: false,
      message: "Waduh, id setoran-nya kagak ada mas, apa yang mau diapus!",
    });
  }

  try {
    await prisma.setoran
      .delete({
        where: {
          id: id_setoran,
        },
      })
      .then(() => {
        return res.status(200).json({
          response: true,
          message: "Yeay, data setoran berhasil di-batalkan! ✨",
        });
      });
  } catch (error) {
    return res.status(500).json({
      response: false,
      message: "Oops! ada kesalahan di server kami 😭",
    });
  }
};

const findMahasiswaByNameOrNim = async (req: Request, res: Response) => {
  const { search, nip, angkatan } = req.query;

  try {
    const result = await prisma.$queryRaw`
			SELECT 
				nim, nama
			FROM 
				mahasiswa 
			WHERE 
				CONCAT('20', SUBSTRING(nim, 2, 2)) = ${angkatan}
				AND nip = ${nip}
				AND (LOWER(nama) LIKE ${`%${search}%`} OR LOWER(nim) LIKE ${`%${search}%`});
		`;

    res.status(200).json({
      response: true,
      message: "Berikut list data mahasiswa yang sesuai!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      response: false,
      message: "Oops! ada kesalahan di server kami 😭",
    });
  }
};

export {
  getInfoDosenByEmail,
  findMahasiswaByNameOrNim,
  postSetoran,
  deleteSetoranByID,
};
