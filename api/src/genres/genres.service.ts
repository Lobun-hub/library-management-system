import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({ data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A genre with this name already exists.');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.genre.findMany({
      include: { _count: { select: { books: true } } },
    });
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });
    if (!genre) {
      throw new NotFoundException(`Genre ${id} was not found.`);
    }
    return genre;
  }

  async update(id: string, dto: UpdateGenreDto) {
    await this.ensureExists(id);
    try {
      return await this.prisma.genre.update({ where: { id }, data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A genre with this name already exists.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.ensureExists(id);
    try {
      return await this.prisma.genre.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException('Cannot delete a genre that has books.');
      }
      throw error;
    }
  }

  private async ensureExists(id: string): Promise<void> {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!genre) {
      throw new NotFoundException(`Genre ${id} was not found.`);
    }
  }
}
