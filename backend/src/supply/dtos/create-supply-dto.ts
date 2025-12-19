import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSupplyDto {
  @IsNumber()
  @IsNotEmpty()
  supplier_entity_id: number;

  @IsNumber()
  @IsNotEmpty()
  maker_product_id: number;
}
