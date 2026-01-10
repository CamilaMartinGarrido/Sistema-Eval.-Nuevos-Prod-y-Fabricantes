import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateExploratoryOfferDto {
  @IsNumber()
  @IsOptional()
  supply_id?: number;

  @IsNumber()
  @IsOptional()
  offered_price?: number;
    
  @IsNumber()
  @IsOptional()
  reference_purchase_id?: number;

  @IsString()
  @IsOptional()
  analysis_date?: string;
}
