import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetOptDTO {
  @IsOptional()
  @ApiProperty({ required: false })
  search?: string;

  @IsOptional()
  divisionId?: number;
}
