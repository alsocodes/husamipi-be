import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllDto } from 'src/utils/dto';
import { GetOptDTO } from 'src/utils/dto/get-opt.dto';
import { ErrorHandling } from 'src/utils/error-handling';
import { filterDtoTransform } from 'src/utils/helper';
import { CreateRoleDTO } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

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
          { label: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (filters) {
      where = {
        ...where,
        AND: filterDtoTransform(filters),
      };
    }

    const { count, rows } = await this.prismaService.findAndCountAll({
      table: this.prismaService.role,
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
    return await this.prismaService.role.findUnique({
      where: { id: Number(id) },
    });
  }

  async create(userId: number, { name, accesses }: CreateRoleDTO) {
    try {
      console.log(userId);
      return await this.prismaService.role.create({
        data: { name, accesses, createdBy: userId },
      });
    } catch (error) {
      // console.log(error);
      throw new ErrorHandling(error);
    }
  }

  async update(id: number, userId: number, { name, accesses }: CreateRoleDTO) {
    try {
      return await this.prismaService.role.update({
        data: { name, accesses, updatedBy: userId },
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async findOpt({ search }: GetOptDTO) {
    try {
      return await this.prismaService.role
        .findMany({
          select: {
            id: true,
            name: true,
          },
          where: {
            OR: [{ name: { contains: search, mode: 'insensitive' } }],
          },
        })
        .then((results) =>
          results.map(
            ({ id: value, name }) => ({
              value,
              label: name,
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
      return await this.prismaService.role.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
