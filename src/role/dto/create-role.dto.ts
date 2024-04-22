import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoleDTO {
  @IsNotEmpty({ message: 'Nama role harus diisi' })
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  accesses: string[];
}
