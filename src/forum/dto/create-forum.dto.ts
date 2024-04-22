import { ForumStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateForumDTO {
  @IsNotEmpty({ message: 'Judul harus diisi' })
  title: string;

  @IsNotEmpty({ message: 'Keterangan harus diisi' })
  description: string;

  @IsOptional()
  status: ForumStatus;

  @IsOptional()
  statusInfo: string;

  @IsOptional()
  @IsNumber()
  parentId: number;
}
