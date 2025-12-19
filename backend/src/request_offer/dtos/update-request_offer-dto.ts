import { IsNumber, IsOptional } from 'class-validator';

export class UpdateRequestOfferDto {
  @IsNumber()
  @IsOptional()
  application_id?: number;

  @IsNumber()
  @IsOptional()
  exploratory_offer_id?: number;
}
