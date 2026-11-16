import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { FindBooksQueryDto } from './dto/find-books-query.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    await this.ensureGenreExists(dto.genreId);
    return this.prisma.book.create({
      data: dto,
      include: { genre: true },
    });
  }

  findAll({ genreId, search, page, limit }: FindBooksQueryDto) {
    const where: Prisma.BookWhereInput = {};
    if (genreId) {
      where.genreId = genreId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.book.findMany({
      where,
      include: { genre: true },
      orderBy: { title: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) {
      throw new NotFoundException(`Book ${id} was not found.`);
    }
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    await this.findOne(id);
    if (dto.genreId) {
      await this.ensureGenreExists(dto.genreId);
    }
    return this.prisma.book.update({
      where: { id },
      data: dto,
      include: { genre: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }

  private async ensureGenreExists(id: string): Promise<void> {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!genre) {
      throw new NotFoundException(`Genre ${id} was not found.`);
    }
  }
}
