import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetAllDto } from 'src/utils/dto';
import { CanAccess } from 'src/auth/access.decorator';
import { Access } from 'src/auth/access.enum';
import { MateriService } from './materi.service';
import { CreateMateriDTO } from './dto/create-materi.dto';
import { GetOptDTO } from 'src/utils/dto/get-opt.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Controller('materi')
export class MateriController {
  constructor(private readonly materiService: MateriService) {}

  @Get('/accesses')
  @CanAccess(Access.elearning_read)
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
  @CanAccess(Access.elearning_read)
  async find(@Query() dto: GetAllDto) {
    const result = await this.materiService.find(dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Get('/opt')
  // @CanAccess(Access.elearning_read)
  async findOpt(@Query() dto: GetOptDTO) {
    const result = await this.materiService.findOpt(dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Get('/:id')
  @CanAccess(Access.elearning_read)
  async findOne(@Param('id') id: number) {
    const result = await this.materiService.findOne(id);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Post()
  @CanAccess(Access.elearning_create)
  async create(@Body() dto: CreateMateriDTO, @Request() req: any) {
    const result = await this.materiService.create(req.user.id, dto);
    return {
      statusCode: 201,
      message: 'Successfull',
      result,
    };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('attachment', {
      storage: diskStorage({
        destination: './storage/attachment/',
        filename(req, file, callback) {
          callback(null, `${Date.now()}.png`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 100000 }), //100KB
          // new FileTypeValidator({
          //   fileType: '.(png|jpeg|jpg|pdf|xls|xlsx|doc|docx|ppt|pptx)',
          // }),
        ],
      }),
    )
    attachment: Express.Multer.File,
    @Request() req: any,
  ) {
    try {
      console.log(attachment);
      const apiUrl = process.env.API_URL || 'http://localhost:5005';
      const filename = `liputan-internal-${Date.now()}.webp`;
      // await sharp(`./storage/attachment/${attachment.filename}`)
      //   .webp({ quality: 60 })
      //   .toFile(`./storage/attachment/${filename}`);

      // if (fs.existsSync(`./storage/attachment/${attachment.filename}`))
      //   fs.unlinkSync(`./storage/attachment/${attachment.filename}`);
      return {
        succes: true,
        message: 'File succesfully uploaded',
        data: {
          link: `${apiUrl}/storage/attachment/${attachment.fieldname}`,
          file: attachment.filename,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Delete('unlink/:file')
  async unlik(@Param('file') file: String) {
    if (!fs.existsSync(`./storage/attachment/${file}`))
      throw new NotFoundException('file not found');

    fs.unlinkSync(`./storage/attachment/${file}`);
    return {
      statusCode: 200,
      message: 'Successfull',
    };
  }

  @Put('/:id')
  @CanAccess(Access.elearning_update)
  async update(
    @Body() dto: CreateMateriDTO,
    @Request() req: any,
    @Param('id') id: number,
  ) {
    const result = await this.materiService.update(id, req.user.id, dto);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }

  @Delete('/:id')
  @CanAccess(Access.elearning_delete)
  async delete(@Param('id') id: number) {
    const result = await this.materiService.delete(id);
    return {
      statusCode: 200,
      message: 'Successfull',
      result,
    };
  }
}
