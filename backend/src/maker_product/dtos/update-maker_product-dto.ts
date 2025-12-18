import { IsNumber, IsOptional } from 'class-validator';

export class UpdateMakerProductDto {
  @IsNumber()
  @IsOptional()
  product_id?: number;

  @IsNumber()
  @IsOptional()
  maker_id?: number;
}
