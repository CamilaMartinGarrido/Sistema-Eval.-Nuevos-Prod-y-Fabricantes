import { IsBoolean, IsDecimal, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateExploratoryOfferDto {
  @IsNumber()
  @IsOptional()
  evaluation_process_id?: number;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsOptional()
  offered_price?: string;
    
  @IsNumber()
  @IsOptional()
  reference_purchase_id?: number;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsOptional()
  price_difference?: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsOptional()
  percentage_difference?: string;

  @IsString()
  @IsOptional()
  analysis_date?: string;

  @IsBoolean()
  @IsOptional()
  is_competitive?: boolean;
}
