import { Expose, Type } from 'class-transformer';
import { SupplyResponseDto } from 'src/supply/dtos/supply-response.dto';

export class ExploratoryOfferResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => SupplyResponseDto)
  supply: SupplyResponseDto;

  @Expose()
  is_competitive: boolean;

  @Expose()
  created_at_ExploratoryOffer: Date;
}
