import { PrismaClient } from "@prisma/client";
import { response } from "express";

const prisma = new PrismaClient();

const findMahasiswaByNameOrNim = async (req: any, res: any) => {
  const { nama, nim, nip, angkatan } = req.params;

  try {
    const result = await prisma.$queryRaw`
    SELECT nim, nama
    FROM mahasiswa WHERE CONCAT('20', SUBSTRING(nim, 2, 2)) = ${angkatan}
    AND nip = ${nip}
    AND (nama LIKE ${`%${nama}%`} OR nim LIKE ${`%${nim}%`});
    `;

    res.status(200).json({
      response: true,
      message: "Nama atau Nim mahasiswa",
      data: result,
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

const getAllMahasiswaPAByAngkatan = async (req: any, res: any) => {
  const { angkatan, nip } = req.params;

  try {
    const result = await prisma.$queryRaw`
    SELECT nim, nama, CONCAT('20', SUBSTRING(nim, 2, 2)) AS tahun
    FROM mahasiswa
    WHERE CONCAT('20', SUBSTRING(nim, 2, 2)) = ${angkatan} AND nip = ${nip}
    `;

    res.status(200).json({
      response: true,
      message: "Ini adalah list mahasiswa berdasarkan angkatan dan dosen pa",
      data: result,
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

const getInfoMahasiswaPAPerAngkatanByNIP = async (req: any, res: any) => {
  const { nip } = req.params;

  const result = await prisma.mahasiswa.groupBy({
    by: ["nim"],
    _count: {
      nim: true,
    },
    orderBy: {
      nim: "desc",
    },
    where: {
      nip: nip,
    },
    take: 8,
  });

  // Langkah 2: Mengelompokkan hasil berdasarkan tahun dan menghitung jumlah
  const groupedResult = result.reduce((acc, item) => {
    const tahun = `20${item.nim.slice(1, 3)}`;

    if (acc[tahun]) {
      acc[tahun] += item._count.nim;
    } else {
      acc[tahun] = item._count.nim;
    }

    return acc;
  }, {} as Record<string, number>);

  // Langkah 3: Mengonversi objek menjadi array dan mengurutkannya
  const formattedResult = Object.keys(groupedResult)
    .map((tahun) => ({
      tahun,
      jumlah: groupedResult[tahun],
    }))
    .sort((a, b) => b.tahun.localeCompare(a.tahun)); // Mengurutkan tahun secara menurun

  res.status(200).json({
    response: true,
    message: "list detail mahasiswa berdasar nim individu",
    data: formattedResult,
  });
};

export {
  getAllMahasiswaPAByAngkatan,
  getInfoMahasiswaPAPerAngkatanByNIP,
  findMahasiswaByNameOrNim,
};
