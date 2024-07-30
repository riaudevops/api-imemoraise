const getAllMahasiswaPA = async (req: any, res: any) => {
    res.status(200).json({
        response: true,
        message: "list semua mahasiswa berdasar dosen pa",
    });
};

const getMahasiswaPAByNIM = async (req: any, res: any) => {
    const { nim } = req.params;
    res.status(200).json({
        response: true,
        message: "list detail mahasiswa berdasar nim individu",
    });
};

export { getAllMahasiswaPA, getMahasiswaPAByNIM }