import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSupplyDto {
  @IsNumber()
  @IsOptional()
  supplier_id?: number;

  @IsNumber()
  @IsOptional()
  maker_product_id?: number;
}
