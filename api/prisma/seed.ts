import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL must be set to seed the database.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const genreData = [
  { name: 'Fantasy', description: 'Fantasy and magical worlds' },
  {
    name: 'Science Fiction',
    description: 'Speculative and futuristic stories',
  },
  { name: 'Mystery', description: 'Mysteries and detective fiction' },
  { name: 'History', description: 'Historical nonfiction and narratives' },
];

const bookData = [
  {
    title: 'The Dragon Keeper',
    author: 'M. Rowan',
    isbn: '9780000000001',
    publishedYear: 2018,
    genre: 'Fantasy',
  },
  {
    title: 'Moonlit Kingdom',
    author: 'A. Vale',
    isbn: '9780000000002',
    publishedYear: 2020,
    genre: 'Fantasy',
  },
  {
    title: 'The Glass Wizard',
    author: 'N. Hart',
    isbn: '9780000000003',
    publishedYear: 2016,
    genre: 'Fantasy',
  },
  {
    title: 'Forest of Stars',
    author: 'L. Wren',
    isbn: '9780000000004',
    publishedYear: 2022,
    genre: 'Fantasy',
  },
  {
    title: 'Orbit of Tomorrow',
    author: 'J. Mercer',
    isbn: '9780000000005',
    publishedYear: 2019,
    genre: 'Science Fiction',
  },
  {
    title: 'The Last Colony',
    author: 'S. North',
    isbn: '9780000000006',
    publishedYear: 2021,
    genre: 'Science Fiction',
  },
  {
    title: 'Signals from Europa',
    author: 'R. Quinn',
    isbn: '9780000000007',
    publishedYear: 2017,
    genre: 'Science Fiction',
  },
  {
    title: 'A Machine for Mars',
    author: 'P. Ellis',
    isbn: '9780000000008',
    publishedYear: 2023,
    genre: 'Science Fiction',
  },
  {
    title: 'The Missing Ledger',
    author: 'D. Avery',
    isbn: '9780000000009',
    publishedYear: 2015,
    genre: 'Mystery',
  },
  {
    title: 'Midnight at Ash House',
    author: 'C. Bell',
    isbn: '9780000000010',
    publishedYear: 2020,
    genre: 'Mystery',
  },
  {
    title: 'A Curious Alibi',
    author: 'T. Morgan',
    isbn: '9780000000011',
    publishedYear: 2014,
    genre: 'Mystery',
  },
  {
    title: 'The Harbor Case',
    author: 'E. Brooks',
    isbn: '9780000000012',
    publishedYear: 2022,
    genre: 'Mystery',
  },
  {
    title: 'Empires of the Ancient World',
    author: 'K. Foster',
    isbn: '9780000000013',
    publishedYear: 2012,
    genre: 'History',
  },
  {
    title: 'Letters from the Frontier',
    author: 'B. Hayes',
    isbn: '9780000000014',
    publishedYear: 2018,
    genre: 'History',
  },
  {
    title: 'The Making of a Nation',
    author: 'O. Reed',
    isbn: '9780000000015',
    publishedYear: 2021,
    genre: 'History',
  },
  {
    title: 'Maps of the Silk Road',
    author: 'I. Clarke',
    isbn: '9780000000016',
    publishedYear: 2016,
    genre: 'History',
  },
];

async function main(): Promise<void> {
  const genres = await Promise.all(
    genreData.map((genre) =>
      prisma.genre.upsert({
        where: { name: genre.name },
        update: { description: genre.description },
        create: genre,
      }),
    ),
  );
  const genreIds = new Map(genres.map(({ name, id }) => [name, id]));

  await prisma.book.createMany({
    data: bookData.map(({ genre, ...book }) => {
      const genreId = genreIds.get(genre);
      if (!genreId) {
        throw new Error(`Seed data references unknown genre: ${genre}`);
      }

      return { ...book, genreId };
    }),
    skipDuplicates: true,
  });
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
