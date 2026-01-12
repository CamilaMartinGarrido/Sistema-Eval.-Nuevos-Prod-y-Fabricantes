import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSupplierPurchaseDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  supplier_id: number;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  unit_price: string;
    
  @IsNumber()
  @IsNotEmpty()
  purchase_date: string;
}
