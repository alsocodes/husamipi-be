import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllDto } from 'src/utils/dto';
import { GetOptDTO } from 'src/utils/dto/get-opt.dto';
import { ErrorHandling } from 'src/utils/error-handling';
import { filterDtoTransform } from 'src/utils/helper';
import { CreateSaleDTO } from './dto/create-sale.dto';

@Injectable()
export class SaleService {
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
          { customerName: { contains: search, mode: 'insensitive' } },
          { soNumber: { contains: search, mode: 'insensitive' } },
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
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
      table: this.prismaService.sale,
      include: { saleDetails: { include: { product: true } } },
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
    return await this.prismaService.sale.findUnique({
      where: { id: Number(id) },
      include: { saleDetails: { include: { product: true } } },
    });
  }

  async create(userId: number, { saleDetails, ...data }: CreateSaleDTO) {
    try {
      const sale = await this.prismaService.sale.create({
        data: { ...data, createdBy: userId },
      });
      const dds = saleDetails.map((d) => ({
        ...d,
        saleId: sale.id,
        total: (d.price + d.price * (d.ppn / 100)) * d.qty,
      }));
      const total = dds.reduce((a, b) => a + b.total, 0);
      await this.prismaService.saleDetail.createMany({
        data: dds,
      });
      await this.prismaService.sale.update({
        where: { id: sale.id },
        data: { total },
      });

      return await this.findOne(sale.id);
    } catch (error) {
      // console.log(error);
      throw new ErrorHandling(error);
    }
  }

  async update(
    id: number,
    userId: number,
    { saleDetails, ...data }: CreateSaleDTO,
  ) {
    try {
      return await this.prismaService.sale.update({
        data: { ...data, updatedBy: userId },
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async findOpt({ search }: GetOptDTO) {
    try {
      return await this.prismaService.sale
        .findMany({
          select: {
            id: true,
            invoiceNumber: true,
          },
          where: {
            // OR: [{ invoiceNo: { contains: search, mode: 'insensitive' } }],
          },
        })
        .then((results) =>
          results.map(
            ({ id: value, invoiceNumber }) => ({
              value,
              label: invoiceNumber,
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
      return await this.prismaService.sale.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
