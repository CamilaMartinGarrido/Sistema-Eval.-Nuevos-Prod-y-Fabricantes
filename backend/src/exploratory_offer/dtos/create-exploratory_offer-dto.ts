import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @IsNotEmpty()
  price_difference: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  percentage_difference: string;

  @IsString()
  @IsNotEmpty()
  analysis_date: string;

  @IsBoolean()
  @IsNotEmpty()
  is_competitive: boolean;
}
