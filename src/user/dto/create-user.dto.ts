import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Username harus diisi' })
  username: string;

  @IsNotEmpty({ message: 'Email harus diisi' })
  email: string;

  @IsNotEmpty({ message: 'Nama harus diisi' })
  name: string;

  @IsNotEmpty({ message: 'Role harus dipilih' })
  roleId: number;
}
