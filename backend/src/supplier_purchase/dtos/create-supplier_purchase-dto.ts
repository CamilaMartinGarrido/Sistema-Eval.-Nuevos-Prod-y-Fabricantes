import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSupplierPurchaseDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  supplier_id: number;

  @IsNumber()
  @IsNotEmpty()
  unit_price: number;
    
  @IsNumber()
  @IsNotEmpty()
  purchase_date: string;
}
