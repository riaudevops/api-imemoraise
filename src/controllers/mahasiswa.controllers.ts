import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
interface statsInfoSetoranMahasiswaProps {
	label: string;
	jumlah_wajib_setor: number;
	jumlah_sudah_setor: number;
	jumlah_belum_setor: number;
	persentase: string;
}

const getInfoMahasiswaByEmail = async (req: Request, res: Response) => {
	const { email } = req.params;
	try {
		// Mengambil data nama, dan nim mahasiswa berdasarkan email
		const result = await prisma.mahasiswa.findFirst({
			where: {
				email: email,
			},
			select: {
				nama: true,
				nim: true,
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

const getInfoSetoranMahasiswaByNIM = async (req: Request, res: Response) => {
	const { nim } = req.params;
	try {
		// Mengambil data menggunakan query SQL mentah
		const result = await prisma.$queryRaw`
			SELECT 
				surah.label "label",
				COUNT(*) "jumlah_wajib_setor",
				COUNT(setoran.id) "jumlah_sudah_setor",
				(COUNT(*)::numeric - COUNT(setoran.id)::numeric) AS "jumlah_belum_setor",
				CONCAT(
					ROUND(
					(COUNT(setoran.id)::numeric / 
						COUNT(*)::numeric
					) * 100, 2
					)::text,
					'%'
				) AS "persentase"
			FROM
				surah
			LEFT JOIN
				setoran ON setoran.nomor_surah = surah.nomor AND setoran.nim = ${nim}
			GROUP BY
				surah.label
			ORDER BY
				CASE
					WHEN surah.label = 'KP' THEN 1
					WHEN surah.label = 'SEMKP' THEN 2
					WHEN surah.label = 'DAFTAR_TA' THEN 3
					WHEN surah.label = 'SEMPRO' THEN 4
					WHEN surah.label = 'SIDANG_TA' THEN 5
					ELSE 6
				END;
		`;

		const resultWithNumbers = (result as any).map((item: statsInfoSetoranMahasiswaProps) => ({
			label: item.label,
			jumlah_wajib_setor: Number(item.jumlah_wajib_setor),
			jumlah_sudah_setor: Number(item.jumlah_sudah_setor),
			jumlah_belum_setor: Number(item.jumlah_belum_setor),
			persentase: item.persentase,
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

export {
	getInfoMahasiswaByEmail,
	getInfoSetoranMahasiswaByNIM,
	getSurahMahasiswaByNIM,
};
