import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Insert initial data for SURAH
    await prisma.surah.createMany({
        data: [
            { nomor: 78, nama: 'An-Naba\'', label: 'KP' },
            { nomor: 79, nama: 'An-Nazi\'at', label: 'KP' },
            { nomor: 80, nama: 'Abasa', label: 'KP' },
            { nomor: 81, nama: 'At-Takwir', label: 'KP' },
            { nomor: 82, nama: 'Al-Infitar', label: 'KP' },
            { nomor: 83, nama: 'Al-Mutaffifin', label: 'KP' },
            { nomor: 84, nama: 'Al-Inshiqaq', label: 'KP' },
            { nomor: 85, nama: 'Al-Buruj', label: 'KP' },
            { nomor: 86, nama: 'At-Tariq', label: 'SEMKP' },
            { nomor: 87, nama: 'Al-A\'la', label: 'SEMKP' },
            { nomor: 88, nama: 'Al-Ghashiyah', label: 'SEMKP' },
            { nomor: 89, nama: 'Al-Fajr', label: 'SEMKP' },
            { nomor: 90, nama: 'Al-Balad', label: 'SEMKP' },
            { nomor: 91, nama: 'Ash-Shams', label: 'SEMKP' },
            { nomor: 92, nama: 'Al-Lail', label: 'SEMKP' },
            { nomor: 93, nama: 'Adh-Dhuha', label: 'SEMKP' },
            { nomor: 94, nama: 'Ash-Sharh', label: 'DAFTAR_TA' },
            { nomor: 95, nama: 'At-Tin', label: 'DAFTAR_TA' },
            { nomor: 96, nama: 'Al-Alaq', label: 'DAFTAR_TA' },
            { nomor: 97, nama: 'Al-Qadr', label: 'DAFTAR_TA' },
            { nomor: 98, nama: 'Al-Bayyinah', label: 'DAFTAR_TA' },
            { nomor: 99, nama: 'Az-Zalzalah', label: 'DAFTAR_TA' },
            { nomor: 100, nama: 'Al-Adiyat', label: 'SEMPRO' },
            { nomor: 101, nama: 'Al-Qari\'ah', label: 'SEMPRO' },
            { nomor: 102, nama: 'At-Takathur', label: 'SEMPRO' },
            { nomor: 103, nama: 'Al-Asr', label: 'SEMPRO' },
            { nomor: 104, nama: 'Al-Humazah', label: 'SEMPRO' },
            { nomor: 105, nama: 'Al-Fil', label: 'SEMPRO' },
            { nomor: 106, nama: 'Quraysh', label: 'SEMPRO' },
            { nomor: 107, nama: 'Al-Ma\'un', label: 'SEMPRO' },
            { nomor: 108, nama: 'Al-Kawthar', label: 'SEMPRO' },
            { nomor: 109, nama: 'Al-Kafirun', label: 'SEMPRO' },
            { nomor: 110, nama: 'An-Nasr', label: 'SEMPRO' },
            { nomor: 111, nama: 'Al-Masad', label: 'SEMPRO' },
            { nomor: 112, nama: 'Al-Ikhlas', label: 'SIDANG_TA' },
            { nomor: 113, nama: 'Al-Falaq', label: 'SIDANG_TA' },
            { nomor: 114, nama: 'An-Nas', label: 'SIDANG_TA' }
        ]
    });

    console.log("Data seeding completed.");
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });