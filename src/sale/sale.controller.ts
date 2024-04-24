import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { GetAllDto } from 'src/utils/dto';
import { CanAccess } from 'src/auth/access.decorator';
import { Access } from 'src/auth/access.enum';
import { SaleService } from './sale.service';
import { CreateSaleDTO } from './dto/create-sale.dto';
import { GetOptDTO } from 'src/utils/dto/get-opt.dto';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  @CanAccess(Access.sale_read)
  async find(@Query() dto: GetAllDto) {
    const result = await this.saleService.find(dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Get('/opt')
  // @CanAccess(Access.sale_read)
  async findOpt(@Query() dto: GetOptDTO) {
    const result = await this.saleService.findOpt(dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Get('/:id')
  @CanAccess(Access.sale_read)
  async findOne(@Param('id') id: number) {
    const result = await this.saleService.findOne(id);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Post()
  @CanAccess(Access.sale_create)
  async create(@Body() dto: CreateSaleDTO, @Request() req: any) {
    const result = await this.saleService.create(req.user.id, dto);
    return {
      statusCode: 201,
      message: 'Successfull',
      result,
    };
  }

  @Put('/:id')
  @CanAccess(Access.sale_update)
  async update(
    @Body() dto: CreateSaleDTO,
    @Request() req: any,
    @Param('id') id: number,
  ) {
    const result = await this.saleService.update(id, req.user.id, dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Delete('/:id')
  @CanAccess(Access.sale_delete)
  async delete(@Param('id') id: number) {
    const result = await this.saleService.delete(id);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }
}
