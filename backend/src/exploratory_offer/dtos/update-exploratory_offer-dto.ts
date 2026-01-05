import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateExploratoryOfferDto {
  @IsNumber()
  @IsOptional()
  supply_id?: number;

  @IsNumber()
  @IsOptional()
  supplier_price?: number;
    
  @IsNumber()
  @IsOptional()
  last_purchase_price?: number;

  @IsBoolean()
  @IsOptional()
  is_competitive?: boolean;
}
