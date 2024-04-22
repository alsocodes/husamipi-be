import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateMateriDTO {
  @IsNotEmpty({ message: 'Judul harus diisi' })
  title: string;

  @IsNotEmpty({ message: 'Keterangan harus diisi' })
  description: string;

  @IsOptional()
  attachments?: any;
}
