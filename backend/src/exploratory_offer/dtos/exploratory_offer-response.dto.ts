import { Expose, Type } from 'class-transformer';
import { SupplyResponseDto } from 'src/supply/dtos/supply-response.dto';
import { ExploratoryOfferObservationResponseDto } from 'src/exploratory_offer_observation/dtos/exploratory_offer_observation-response.dto';

export class ExploratoryOfferResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => SupplyResponseDto)
  supply: SupplyResponseDto;

  @Expose()
  supplier_price: number;
      
  @Expose()
  last_purchase_price: number;

  @Expose()
  is_competitive: boolean;

  @Expose()
  @Type(() => ExploratoryOfferObservationResponseDto)
  exploratory_offer_observs: ExploratoryOfferObservationResponseDto[];
}
