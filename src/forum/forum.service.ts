import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllDto } from 'src/utils/dto';
import { GetOptDTO } from 'src/utils/dto/get-opt.dto';
import { ErrorHandling } from 'src/utils/error-handling';
import { filterDtoTransform } from 'src/utils/helper';
import { CreateForumDTO } from './dto/create-forum.dto';

@Injectable()
export class ForumService {
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
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
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
      table: this.prismaService.forum,
      include: {
        user: { select: { id: true, name: true } },
        childs: { include: { user: { select: { id: true, name: true } } } },
      },
      take: size,
      skip,
      orderBy: { [orderBy || 'id']: order || 'desc' },
      where: { ...where, parentId: null },
    });

    return {
      count,
      page: Number(page),
      totalPage: Math.ceil(count / size),
      rows,
    };
  }

  async findOne(id: number) {
    return await this.prismaService.forum.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { id: true, name: true } },
        childs: { include: { user: { select: { id: true, name: true } } } },
      },
    });
  }

  async create(userId: number, data: CreateForumDTO) {
    try {
      return await this.prismaService.forum.create({
        data: {
          ...data,
          createdBy: Number(userId),
        },
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async update(id: number, userId: number, data: CreateForumDTO) {
    try {
      return await this.prismaService.forum.update({
        data: { ...data, updatedBy: userId },
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async findOpt({ search }: GetOptDTO) {
    try {
      return await this.prismaService.forum
        .findMany({
          select: {
            id: true,
            title: true,
          },
          where: {
            OR: [{ title: { contains: search, mode: 'insensitive' } }],
          },
        })
        .then((results) =>
          results.map(
            ({ id: value, title }) => ({
              value,
              label: title,
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
      return await this.prismaService.forum.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
