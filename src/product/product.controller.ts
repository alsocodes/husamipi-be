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
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { GetOptDTO } from 'src/utils/dto/get-opt.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @CanAccess(Access.product_read)
  async find(@Query() dto: GetAllDto) {
    const result = await this.productService.find(dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Get('/opt')
  // @CanAccess(Access.product_read)
  async findOpt(@Query() dto: GetOptDTO) {
    const result = await this.productService.findOpt(dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Get('/:id')
  @CanAccess(Access.product_read)
  async findOne(@Param('id') id: number) {
    const result = await this.productService.findOne(id);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Post()
  @CanAccess(Access.product_create)
  async create(@Body() dto: CreateProductDTO, @Request() req: any) {
    const result = await this.productService.create(req.user.id, dto);
    return {
      statusCode: 201,
      message: 'Successfull',
      result,
    };
  }

  @Put('/:id')
  @CanAccess(Access.product_update)
  async update(
    @Body() dto: CreateProductDTO,
    @Request() req: any,
    @Param('id') id: number,
  ) {
    const result = await this.productService.update(id, req.user.id, dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Delete('/:id')
  @CanAccess(Access.product_delete)
  async delete(@Param('id') id: number) {
    const result = await this.productService.delete(id);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }
}
