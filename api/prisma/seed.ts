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
  {
    name: 'Self-Help',
    description: 'Personal growth, habits, relationships, and life skills',
  },
];

const bookData = [
  {
    title: 'The Dragon Keeper',
    author: 'M. Rowan',
    description:
      'A fantasy adventure about a keeper charged with protecting a dragon and the secrets it carries.',
    isbn: '9780000000001',
    publishedYear: 2018,
    genre: 'Fantasy',
  },
  {
    title: 'Moonlit Kingdom',
    author: 'A. Vale',
    description:
      'A journey through a kingdom where its oldest magic awakens after nightfall.',
    isbn: '9780000000002',
    publishedYear: 2020,
    genre: 'Fantasy',
  },
  {
    title: 'The Glass Wizard',
    author: 'N. Hart',
    description:
      'A young wizard must master fragile glass magic before it changes the fate of the realm.',
    isbn: '9780000000003',
    publishedYear: 2016,
    genre: 'Fantasy',
  },
  {
    title: 'Forest of Stars',
    author: 'L. Wren',
    description:
      'An expedition into an enchanted forest follows a trail written in the stars.',
    isbn: '9780000000004',
    publishedYear: 2022,
    genre: 'Fantasy',
  },
  {
    title: 'Orbit of Tomorrow',
    author: 'J. Mercer',
    description:
      'A science-fiction mission discovers a new orbit that may reshape the human future.',
    isbn: '9780000000005',
    publishedYear: 2019,
    genre: 'Science Fiction',
  },
  {
    title: 'The Last Colony',
    author: 'S. North',
    description:
      'Settlers at the edge of space face the challenge of building a home on the last colony.',
    isbn: '9780000000006',
    publishedYear: 2021,
    genre: 'Science Fiction',
  },
  {
    title: 'Signals from Europa',
    author: 'R. Quinn',
    description:
      'A research team investigates a mysterious signal coming from the moon Europa.',
    isbn: '9780000000007',
    publishedYear: 2017,
    genre: 'Science Fiction',
  },
  {
    title: 'A Machine for Mars',
    author: 'P. Ellis',
    description:
      'A mission to Mars depends on a machine that may change the settlement future.',
    isbn: '9780000000008',
    publishedYear: 2023,
    genre: 'Science Fiction',
  },
  {
    title: 'The Missing Ledger',
    author: 'D. Avery',
    description:
      'A missing ledger draws an investigator into a mystery built on hidden accounts and uneasy suspects.',
    isbn: '9780000000009',
    publishedYear: 2015,
    genre: 'Mystery',
  },
  {
    title: 'Midnight at Ash House',
    author: 'C. Bell',
    description:
      'A disappearance at Ash House turns a late-night gathering into a close-knit mystery.',
    isbn: '9780000000010',
    publishedYear: 2020,
    genre: 'Mystery',
  },
  {
    title: 'A Curious Alibi',
    author: 'T. Morgan',
    description:
      'An investigator tests an unusual alibi while untangling a puzzling case.',
    isbn: '9780000000011',
    publishedYear: 2014,
    genre: 'Mystery',
  },
  {
    title: 'The Harbor Case',
    author: 'E. Brooks',
    description:
      'Conflicting accounts and a trail of clues make a harbor investigation difficult to resolve.',
    isbn: '9780000000012',
    publishedYear: 2022,
    genre: 'Mystery',
  },
  {
    title: 'Empires of the Ancient World',
    author: 'K. Foster',
    description:
      'A survey of ancient empires and the forces behind their rise, influence, and decline.',
    isbn: '9780000000013',
    publishedYear: 2012,
    genre: 'History',
  },
  {
    title: 'Letters from the Frontier',
    author: 'B. Hayes',
    description:
      'Correspondence offers a personal perspective on life and change along a frontier.',
    isbn: '9780000000014',
    publishedYear: 2018,
    genre: 'History',
  },
  {
    title: 'The Making of a Nation',
    author: 'O. Reed',
    description:
      'A historical account of the events and decisions behind the founding of a nation.',
    isbn: '9780000000015',
    publishedYear: 2021,
    genre: 'History',
  },
  {
    title: 'Maps of the Silk Road',
    author: 'I. Clarke',
    description:
      'A history of the routes, cities, and cultural exchange connected by the Silk Road.',
    isbn: '9780000000016',
    publishedYear: 2016,
    genre: 'History',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description:
      'James Clear presents a practical approach to lasting habits through small changes and reliable systems.',
    isbn: '9780735211292',
    publishedYear: 2018,
    genre: 'Self-Help',
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    description:
      'Cal Newport explores sustained, distraction-free focus and ways to cultivate it.',
    isbn: '9781455586691',
    publishedYear: 2016,
    genre: 'Self-Help',
  },
  {
    title: 'Mindset',
    author: 'Carol S. Dweck',
    description:
      'Carol Dweck examines how beliefs about ability influence learning, persistence, and growth.',
    isbn: '9780345472328',
    publishedYear: 2006,
    genre: 'Self-Help',
  },
  {
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    description:
      'Eckhart Tolle offers guidance on presence and loosening attachment to past and future.',
    isbn: '9781577314806',
    publishedYear: 1997,
    genre: 'Self-Help',
  },
  {
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    description:
      'Mark Manson reframes personal growth around choosing what matters and accepting personal limits.',
    isbn: '9780062457714',
    publishedYear: 2016,
    genre: 'Self-Help',
  },
  {
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    description:
      'Dale Carnegie offers a classic guide to communication, social connection, and effective relationships.',
    isbn: '9780671027032',
    publishedYear: 1936,
    genre: 'Self-Help',
  },
  {
    title: 'Think Again',
    author: 'Adam Grant',
    description:
      'Adam Grant explores the value of questioning assumptions and staying open to new ideas.',
    isbn: '9781984878106',
    publishedYear: 2021,
    genre: 'Self-Help',
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description:
      'Morgan Housel uses stories to examine how behavior, time, and risk shape financial decisions.',
    isbn: '9780857197689',
    publishedYear: 2020,
    genre: 'Self-Help',
  },
  {
    title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    description:
      'Robert Greene examines power, influence, and human behavior through historical examples.',
    isbn: '9780140280197',
    publishedYear: 1998,
    genre: 'Self-Help',
  },
  {
    title: 'The Art of Seduction',
    author: 'Robert Greene',
    description:
      'Robert Greene explores historical archetypes and the dynamics of interpersonal influence.',
    isbn: '9780142001196',
    publishedYear: 2001,
    genre: 'Self-Help',
  },
  {
    title: 'The 33 Strategies of War',
    author: 'Robert Greene',
    description:
      'Robert Greene draws on history and military principles to discuss strategy and conflict.',
    isbn: '9780143112785',
    publishedYear: 2006,
    genre: 'Self-Help',
  },
  {
    title: 'The 50th Law',
    author: 'Robert Greene and 50 Cent',
    description:
      'Robert Greene and 50 Cent discuss fearlessness, adaptability, and ambition.',
    isbn: '9780061774607',
    publishedYear: 2009,
    genre: 'Self-Help',
  },
  {
    title: 'Mastery',
    author: 'Robert Greene',
    description:
      'Robert Greene examines how practice, mentorship, and perseverance contribute to expertise.',
    isbn: '9780670026302',
    publishedYear: 2012,
    genre: 'Self-Help',
  },
  {
    title: 'The Laws of Human Nature',
    author: 'Robert Greene',
    description:
      'Robert Greene explores motivations and behavior to help readers better understand themselves and others.',
    isbn: '9780143111375',
    publishedYear: 2018,
    genre: 'Self-Help',
  },
  {
    title: 'The Daily Laws',
    author: 'Robert Greene',
    description:
      'A year of daily reflections on power, strategy, mastery, and human nature.',
    isbn: '9780593299234',
    publishedYear: 2021,
    genre: 'Self-Help',
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

  const books = bookData.map(({ genre, ...book }) => {
    const genreId = genreIds.get(genre);
    if (!genreId) {
      throw new Error(`Seed data references unknown genre: ${genre}`);
    }

    return { ...book, genreId };
  });

  await prisma.book.createMany({
    data: books,
    skipDuplicates: true,
  });

  await Promise.all(
    books.map(({ isbn, description }) =>
      prisma.book.updateMany({
        where: { isbn, description: '' },
        data: { description },
      }),
    ),
  );
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
