import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateExploratoryOfferDto {
  @IsNumber()
  @IsOptional()
  supply_id?: number;

  @IsBoolean()
  @IsOptional()
  is_competitive?: boolean;
}
