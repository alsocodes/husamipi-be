import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class ChangePasswordDTO {
  @IsNotEmpty()
  @Length(6, 30, { message: 'Password harus minimal 6 karakter' })
  oldPassword: string;

  @IsNotEmpty()
  @Length(6, 30, { message: 'Password harus minimal 6 karakter' })
  newPassword: string;
}
