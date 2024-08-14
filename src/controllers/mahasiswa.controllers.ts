import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
interface exmaple {
  label: string;
  jumlah_setor: string;
  total_surah: string;
  persentase : string;
}
const getInfoSetoranMahasiswaByNIM = async (req: Request, res: Response) => {
  const { nim } = req.params;
  try {
    // Mengambil data menggunakan query SQL mentah
    const result = await prisma.$queryRaw`
      SELECT 
        SURAH.LABEL AS "label", 
        COUNT(SETORAN.ID) AS "jumlah_setor",
        CASE 
          WHEN SURAH.LABEL = 'KP' THEN 8
          WHEN SURAH.LABEL = 'SEMKP' THEN 8
          WHEN SURAH.LABEL = 'DAFTAR_TA' THEN 6
          WHEN SURAH.LABEL = 'SEMPRO' THEN 12
          WHEN SURAH.LABEL = 'SIDANG_TA' THEN 3
          ELSE 0 
        END AS "total_surah",
        CONCAT(
          ROUND(
            (COUNT(SETORAN.ID)::numeric / 
             CASE 
               WHEN SURAH.LABEL = 'KP' THEN 8
               WHEN SURAH.LABEL = 'SEMKP' THEN 8
               WHEN SURAH.LABEL = 'DAFTAR_TA' THEN 6
               WHEN SURAH.LABEL = 'SEMPRO' THEN 12
               WHEN SURAH.LABEL = 'SIDANG_TA' THEN 3
               ELSE 0 
             END
            ) * 100, 2
          )::text,
          '%'
        ) AS "persentase"
      FROM 
        SURAH
      LEFT JOIN 
        SETORAN ON SETORAN.NOMOR_SURAH = SURAH.NOMOR AND SETORAN.NIM = ${nim}
      GROUP BY 
        SURAH.LABEL
      ORDER BY 
        SURAH.LABEL;
    `;

    console.log("ini ", nim);
    const resultWithNumbers = (result as any).map((item: exmaple) => ({
      label : item.label,
      jumlah : Number(item.jumlah_setor),
      total : Number(item.total_surah),
      persentase : item.persentase

    }));

    res.status(200).json({
      response: true,
      message: "list detail mahasiswa berdasar nim individu",
      data: resultWithNumbers,
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({
      response: false,
      message: "Error retrieving data",
      error: error,
    });
  }
};

const getSurahMahasiswaByNIM = async (req: any, res: any) => {
  const { nim } = req.params;

  const result = await prisma.surah.findMany({
    orderBy: {
      nomor: "asc",
    },
    select: {
      nomor: true,
      nama: true, // SELECT SURAH.NAMA
      label: true, // SELECT SURAH.LABEL
      setoran: {
        where: {
          nim: nim, // Kondisi pada JOIN: SETORAN.NIM = nim
        },
        select: {
          tgl_validasi: true, // SELECT SETORAN.TGL_VALIDASI
          dosen: {
            select: {
              nama: true, // SELECT DOSEN.NAMA
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    response: true,
    message: "list surah pov mahasiswa",
    data: result,
  });
};

export { getInfoSetoranMahasiswaByNIM, getSurahMahasiswaByNIM };
