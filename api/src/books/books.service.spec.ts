import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { FindBooksQueryDto } from './dto/find-books-query.dto.js';
import { BooksService } from './books.service.js';

describe('BooksService', () => {
  it('filters by genre and search and applies pagination', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const module = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: { book: { findMany } },
        },
      ],
    }).compile();
    const service = module.get(BooksService);
    const query = Object.assign(new FindBooksQueryDto(), {
      genreId: 'genre-1',
      search: 'moon',
      page: 2,
      limit: 5,
    });

    await service.findAll(query);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          genreId: 'genre-1',
          OR: [
            { title: { contains: 'moon', mode: 'insensitive' } },
            { author: { contains: 'moon', mode: 'insensitive' } },
          ],
        },
        skip: 5,
        take: 5,
      }),
    );
    await module.close();
  });
});
