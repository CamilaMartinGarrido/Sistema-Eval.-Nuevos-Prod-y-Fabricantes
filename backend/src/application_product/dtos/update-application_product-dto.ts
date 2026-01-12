import { IsNumber, IsOptional } from 'class-validator';

export class UpdateApplicationProductDto {
  @IsNumber()
  @IsOptional()
  application_id?: number;

  @IsNumber()
  @IsOptional()
  product_id?: number;
}
