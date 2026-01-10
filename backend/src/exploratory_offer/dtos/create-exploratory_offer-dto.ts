import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateExploratoryOfferDto {
  @IsNumber()
  @IsNotEmpty()
  supply_id: number;

  @IsNumber()
  @IsNotEmpty()
  offered_price: number;
    
  @IsNumber()
  @IsNotEmpty()
  reference_purchase_id: number;

  @IsBoolean()
  @IsNotEmpty()
  analysis_date: string;
}
