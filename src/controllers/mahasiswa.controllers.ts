const getStat = async (req: any, res: any) => {
    res.status(200).json({
        response: true,
        message: "detail progres status label surah setoran",
    });
};

const getFormSurah = async (req: any, res: any) => {
    res.status(200).json({
        response: true,
        message: "list surah pov mahasiswa",
    });
};

export { getStat, getFormSurah }