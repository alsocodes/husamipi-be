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
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/create-role.dto';
import { GetOptDTO } from 'src/utils/dto/get-opt.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/accesses')
  @CanAccess(Access.role_read)
  async allAccess() {
    return {
      statusCode: 200,
      message: 'Successfull',
      result: {
        accesses: Object.values(Access),
      },
    };
  }

  @Get()
  @CanAccess(Access.role_read)
  async find(@Query() dto: GetAllDto) {
    const result = await this.roleService.find(dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Get('/opt')
  // @CanAccess(Access.role_read)
  async findOpt(@Query() dto: GetOptDTO) {
    const result = await this.roleService.findOpt(dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Get('/:id')
  @CanAccess(Access.role_read)
  async findOne(@Param('id') id: number) {
    const result = await this.roleService.findOne(id);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Post()
  @CanAccess(Access.role_create)
  async create(@Body() dto: CreateRoleDTO, @Request() req: any) {
    const result = await this.roleService.create(req.user.id, dto);
    return {
      statusCode: 201,
      message: 'Successfull',
      result,
    };
  }

  @Put('/:id')
  @CanAccess(Access.role_update)
  async update(
    @Body() dto: CreateRoleDTO,
    @Request() req: any,
    @Param('id') id: number,
  ) {
    const result = await this.roleService.update(id, req.user.id, dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Delete('/:id')
  @CanAccess(Access.role_delete)
  async delete(@Param('id') id: number) {
    const result = await this.roleService.delete(id);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }
}
