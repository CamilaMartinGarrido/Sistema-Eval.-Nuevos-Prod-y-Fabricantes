import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExploratoryOfferDto {
  @IsNumber()
  @IsNotEmpty()
  evaluation_process_id: number;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  offered_price: string;
    
  @IsNumber()
  @IsNotEmpty()
  reference_purchase_id: number;

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
