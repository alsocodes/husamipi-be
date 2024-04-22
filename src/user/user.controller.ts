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
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetOptDTO } from 'src/utils/dto/get-opt.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CanAccess(Access.user_read)
  async find(@Query() dto: GetAllDto) {
    const result = await this.userService.find(dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Get('/opt')
  @CanAccess(Access.user_read)
  async findOpt(@Query() dto: GetOptDTO) {
    const result = await this.userService.findOpt(dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Get('/:id')
  @CanAccess(Access.user_read)
  async findOne(@Param('id') id: number) {
    const result = await this.userService.findOne(id);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Post()
  @CanAccess(Access.user_create)
  async create(@Body() dto: CreateUserDTO, @Request() req: any) {
    const result = await this.userService.create(req.user.id, dto);
    return {
      statusCode: 201,
      message: 'Successfull',
      result,
    };
  }

  @Put('/:id')
  @CanAccess(Access.user_update)
  async update(
    @Body() dto: CreateUserDTO,
    @Request() req: any,
    @Param('id') id: number,
  ) {
    const result = await this.userService.update(id, req.user.id, dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Delete('/:id')
  @CanAccess(Access.user_delete)
  async delete(@Param('id') id: number) {
    const result = await this.userService.delete(id);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }
}
