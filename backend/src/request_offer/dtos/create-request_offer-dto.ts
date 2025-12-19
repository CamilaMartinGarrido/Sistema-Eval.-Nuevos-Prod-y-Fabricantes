import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRequestOfferDto {
  @IsNumber()
  @IsNotEmpty()
  application_id: number;

  @IsNumber()
  @IsNotEmpty()
  exploratory_offer_id: number;
}
