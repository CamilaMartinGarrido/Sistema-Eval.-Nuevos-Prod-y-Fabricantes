import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSupplierPurchaseDto {
  @IsNumber()
  @IsOptional()
  product_id?: number;

  @IsNumber()
  @IsOptional()
  supplier_id?: number;

  @IsNumber()
  @IsOptional()
  unit_price?: number;
    
  @IsNumber()
  @IsOptional()
  purchase_date?: string;
}
