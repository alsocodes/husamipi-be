import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  Validate,
} from 'class-validator';
import { FiltersValidator } from '../validator/filters.validator';
import { Transform } from 'class-transformer';

export class GetAllDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  page?: number = 0;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  size?: number = 20;

  @IsOptional()
  @ApiProperty({ required: false })
  orderBy?: string = 'id';

  @IsOptional()
  @ApiProperty({ required: false })
  order?: string = 'asc';

  @IsOptional()
  @ApiProperty({ required: false })
  search?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @Validate(FiltersValidator)
  filters?: string;
}
