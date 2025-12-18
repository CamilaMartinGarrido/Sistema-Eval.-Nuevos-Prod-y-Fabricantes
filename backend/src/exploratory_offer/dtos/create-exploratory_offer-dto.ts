import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateExploratoryOfferDto {
  @IsNumber()
  @IsNotEmpty()
  supply_id: number;

  @IsBoolean()
  is_competitive: boolean;
}
