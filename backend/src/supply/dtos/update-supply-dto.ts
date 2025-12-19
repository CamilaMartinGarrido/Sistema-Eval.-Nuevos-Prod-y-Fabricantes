import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSupplyDto {
  @IsNumber()
  @IsOptional()
  supplier_entity_id?: number;

  @IsNumber()
  @IsOptional()
  maker_product_id?: number;
}
