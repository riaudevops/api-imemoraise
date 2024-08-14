import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllMahasiswaPAByAngkatan = async (req: any, res: any) => {
    const { angkatan, nip, nim, nama } = req.query;
    console.log(angkatan, nip, nim, nama); 
    res.status(200).json({
        response: true,
        message: "list semua mahasiswa berdasar dosen pa",
    });
};

const getInfoMahasiswaPAPerAngkatanByNIP = async (req: any, res: any) => {
    const { nip } = req.params;

    const result = await prisma.mahasiswa.groupBy({
        by: ['nim'],
        _count: {
          nim: true,
        },
        orderBy: {
          nim: 'desc',
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
        data: formattedResult
    });
};

export { getAllMahasiswaPAByAngkatan, getInfoMahasiswaPAPerAngkatanByNIP }