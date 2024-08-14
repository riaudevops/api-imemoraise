import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class IDGenerator {
  public static async generateNewId(): Promise<string> {
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

export { IDGenerator };
