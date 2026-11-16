import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { getJwtSecret } from './jwt-secret.js';
import { AuthenticatedUser } from './jwt.strategy.js';
import { compare, hash } from 'bcryptjs';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (Buffer.byteLength(dto.password, 'utf8') > 72) {
      throw new BadRequestException('Password must be at most 72 bytes.');
    }
    const password = await hash(dto.password, 12);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email.toLowerCase(),
          password,
        },
        select: publicUserSelect,
      });
      return {
        accessToken: await this.issueAccessToken({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
        user,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An account with this email already exists.',
        );
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user?.password || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: await this.issueAccessToken(authenticatedUser),
      user: authenticatedUser,
    };
  }

  private issueAccessToken(user: AuthenticatedUser): Promise<string> {
    return this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { secret: getJwtSecret(), expiresIn: '1h' },
    );
  }
}
