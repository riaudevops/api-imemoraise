import { PrismaClient } from "@prisma/client";
import { IDGenerator } from "../services/dosen.services";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getInfoDosenByEmail = async (req: Request, res: Response) => {
	const { email } = req.params;
	try {
		// Mengambil data nama, dan nim mahasiswa berdasarkan email
		const result = await prisma.dosen.findFirst({
			where: {
				email: email,
			},
			select: {
				nama: true,
				nip: true,
			},
		});
		res.status(200).json({
			response: true,
			message: "data mahasiswa",
			data: result,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			response: false,
			message: "internal server error",
		});
	}
};

const postSetoran = async (req: Request, res: Response) => {
	const { nim, nip, nomor_surah } = req.body;

	// Validasi input
	if (!nim || !nip || !nomor_surah) {
		return res.status(400).json({
			response: false,
			message: "Missing required fields",
		});
	}

	// Convert nomor_surah to integer if it is a string
	const nomorSurahInt = parseInt(nomor_surah as string, 10);

	if (isNaN(nomorSurahInt)) {
		return res.status(400).json({
			response: false,
			message: "Invalid nomor_surah format",
		});
	}

	try {
		// Periksa apakah kombinasi nim, nip, dan nomor_surah sudah ada
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
			return res.status(409).json({
				response: false,
				message: "Combination of nim, nip, and nomor_surah already exists",
			});
		}

		// Generate ID baru
		const idSetoran = await IDGenerator.generateNewId();

		// Simpan data ke database
		const result = await prisma.setoran.create({
			data: {
				id: idSetoran,
				tgl_setoran: new Date(),
				tgl_validasi: new Date(),
				nim: nim as string,
				nip: nip as string,
				nomor_surah: nomorSurahInt,
			},
		});

		// Kirim respons sukses
		res.status(201).json({
			response: true,
			message: "Data terkirim",
			data: result,
		});
	} catch (error) {
		// Tangani kesalahan
		console.error("Error executing query:", error);
		res.status(500).json({
			response: false,
			message: "Error posting data",
			error: "test", // Hanya kirim pesan error untuk keamanan
		});
	}
};

const findMahasiswaByNameOrNim = async (req: Request, res: Response) => {
	const { search, nip, angkatan } = req.query;

	try {
		const result = await prisma.$queryRaw`
    SELECT nim, nama
    FROM mahasiswa WHERE CONCAT('20', SUBSTRING(nim, 2, 2)) = ${angkatan}
    AND nip = ${nip}
    AND (LOWER(nama) LIKE ${`%${search}%`} OR LOWER(nim) LIKE ${`%${search}%`});
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

const getInfoMahasiswaPAPerAngkatanByNIP = async (req: Request, res: Response) => {
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
  getInfoDosenByEmail,
	getInfoMahasiswaPAPerAngkatanByNIP,
	findMahasiswaByNameOrNim,
	postSetoran,
};
