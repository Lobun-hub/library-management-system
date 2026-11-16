import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
