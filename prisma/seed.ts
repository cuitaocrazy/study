import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tables = await prisma.$queryRaw<
  {
    name: string;
  }[]
>`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';`;

await prisma.$transaction([
  // Disable FK constraints to avoid relation conflicts during deletion
  prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF`),
  // Delete all rows from each table, preserving table structures
  ...tables.map(({ name }) =>
    prisma.$executeRawUnsafe(`DELETE from "${name}"`)
  ),
  prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON`),
]);

await prisma.videos.create({
  data: {
    title: "Everything At Once",
    originalUrl: "https://youtu.be/W58no8qD8ws",
    subtitles: {
      create: [
        {
          en: "As sly as a fox, as strong as an ox. As fast as a hare, as brave as a bear. As",
          cn: "",
          startTime: 0,
          endTime: 5,
          orderId: 0,
        },
      ],
    },
  },
});
