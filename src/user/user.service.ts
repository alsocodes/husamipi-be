import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllDto } from 'src/utils/dto';
import { filterDtoTransform } from 'src/utils/helper';
import { CreateUserDTO } from './dto/create-user.dto';
import { ErrorHandling } from 'src/utils/error-handling';
import { GetOptDTO } from 'src/utils/dto/get-opt.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUsernameOrEmail(username: string) {
    return this.prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] },
      include: {
        role: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }
  async updateRefreshToken(
    id: number,
    token: string | null,
    isApp: boolean = false,
  ) {
    const user = await this.findById(id);
    const data = { refreshToken: token, lastRefreshToken: user.refreshToken };
    return await this.prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updatePassword(id: number, password: string) {
    return this.prisma.user.update({ where: { id }, data: { password } });
  }

  async find(dto: GetAllDto) {
    let { page, size, orderBy, order, filters, search } = dto;

    size = Number(size) || 20;
    page = page || 1;
    const skip = (page - 1) * size;

    let where = {};
    if (search) {
      where = {
        ...where,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (filters) {
      where = {
        ...where,
        AND: filterDtoTransform(filters),
      };
    }

    const { count, rows } = await this.prisma.findAndCountAll({
      table: this.prisma.user,
      include: {
        role: {
          select: { id: true, name: true },
        },
      },
      take: size,
      skip,
      orderBy: { [orderBy || 'id']: order || 'desc' },
      where,
    });

    return {
      count,
      page: Number(page),
      totalPage: Math.ceil(count / size),
      rows,
    };
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id: Number(id) },
      include: {},
    });
  }

  async create(userId: number, data: CreateUserDTO) {
    try {
      const passwordHash = await bcrypt.hash('123456', 10);
      const { password, refreshToken, lastRefreshToken, ...user } =
        await this.prisma.user.create({
          data: {
            ...data,
            createdBy: userId,
            password: passwordHash,
          },
        });
      return user;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async update(id: number, userId: number, data: CreateUserDTO) {
    try {
      const { password, refreshToken, lastRefreshToken, ...user } =
        await this.prisma.user.update({
          data: {
            ...data,
            updatedBy: userId,
          },
          where: { id: Number(id) },
        });

      return user;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async findOpt({ search }: GetOptDTO) {
    try {
      return await this.prisma.user
        .findMany({
          select: {
            id: true,
            name: true,
          },
          where: {
            ...(search
              ? {
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } },
                  ],
                }
              : {}),
          },
        })
        .then((results) =>
          results.map(
            ({ id: value, name: label }) => ({
              value,
              label,
            }),
            [],
          ),
        );
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
