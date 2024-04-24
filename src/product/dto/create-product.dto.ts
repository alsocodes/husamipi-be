import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty({ message: 'Nama harus diisi' })
  name: string;

  @IsNotEmpty({ message: 'Harga harus diisi' })
  price: number;
}
