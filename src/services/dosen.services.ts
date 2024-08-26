import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Generate id untuk setoran
class IDGenerator {
  public static async generateNewIdSetoran(): Promise<string> {
    const lastId = await prisma.setoran.findFirst({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
      },
    });

    const prefix = "SH";
    const currentYear = new Date().getFullYear().toString().slice(-2); // Tahun 2 digit terakhir
    let newNumber: number;

    if (lastId) {
      const lastYear = lastId.id.slice(2, 4);
      const lastNumber = parseInt(lastId.id.slice(4), 10);

      if (lastYear === currentYear) {
        newNumber = lastNumber + 1;
      } else {
        newNumber = 1; // Tahun baru, reset nomor urut
      }
    } else {
      newNumber = 1; // Jika belum ada ID sebelumnya
    }

    const newNumberStr = newNumber.toString().padStart(4, "0");
    return `${prefix}${currentYear}${newNumberStr}`;
  }
}

const getInfoMahasiswaPAPerAngkatanByNIP = async (nip: string) => {
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

  return formattedResult;
};

const getAllInfoSetoranByNip = async (nip: string) => {
  try {
    const result = await prisma.setoran.groupBy({
      by: ["tgl_validasi"],
      where: {
        nip: nip,
      },
      _count: {
        _all: true, // Menghitung total record untuk setiap grup
      },
      take: 8, // Membatasi hasil ke 8 record
      orderBy: {
        tgl_validasi: "asc", // Atau 'desc' tergantung urutan yang diinginkan
      },
    });

    // Mengganti nama _count menjadi total
    const formattedResult = result.map((r) => ({
      x: r.tgl_validasi,
      y: r._count._all,
    }));
    return formattedResult;
  } catch (error) {
    return error;
  }
};

export {
  IDGenerator,
  getInfoMahasiswaPAPerAngkatanByNIP,
  getAllInfoSetoranByNip,
};
