import { IsDecimal, IsNumber, IsOptional } from 'class-validator';

export class UpdateSupplierPurchaseDto {
  @IsNumber()
  @IsOptional()
  product_id?: number;

  @IsNumber()
  @IsOptional()
  supplier_id?: number;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsOptional()
  unit_price?: string;
    
  @IsNumber()
  @IsOptional()
  purchase_date?: string;
}
