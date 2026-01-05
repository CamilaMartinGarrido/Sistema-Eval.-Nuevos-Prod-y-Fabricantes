import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateExploratoryOfferDto {
  @IsNumber()
  @IsNotEmpty()
  supply_id: number;

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
