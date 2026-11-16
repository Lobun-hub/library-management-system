import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { compare } from 'bcryptjs';
import { Role } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'unit-test-secret');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('hashes passwords before saving and omits them from the response', async () => {
    const create = vi.fn(
      async ({
        data,
      }: {
        data: { name: string; email: string; password: string };
      }) => ({
        id: 'user-1',
        name: data.name,
        email: data.email,
        role: Role.PATRON,
        createdAt: new Date(),
      }),
    );
    const signAsync = vi.fn().mockResolvedValue('signed-token');
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: { user: { create } },
        },
        {
          provide: JwtService,
          useValue: { signAsync },
        },
      ],
    }).compile();
    const service = module.get(AuthService);

    const result = await service.register({
      name: 'Reader',
      email: 'READER@example.com',
      password: 'a-secure-password',
    });
    const savedPassword = create.mock.calls[0]?.[0].data.password;

    expect(savedPassword).not.toBe('a-secure-password');
    expect(await compare('a-secure-password', savedPassword ?? '')).toBe(true);
    expect(result.user).not.toHaveProperty('password');
    expect(result.accessToken).toBe('signed-token');
    expect(signAsync).toHaveBeenCalledOnce();
    expect(create.mock.calls[0]?.[0].data.email).toBe('reader@example.com');
    expect(create.mock.calls[0]?.[0].select).not.toHaveProperty('password');
    await module.close();
  }, 15_000);
});
