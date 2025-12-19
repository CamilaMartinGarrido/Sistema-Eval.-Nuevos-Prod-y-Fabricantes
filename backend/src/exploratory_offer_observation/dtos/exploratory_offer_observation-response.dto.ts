import { Expose, Type } from 'class-transformer';
import { ExploratoryOfferResponseDto } from 'src/exploratory_offer/dtos/exploratory_offer-response.dto';
import { ObservationResponseDto } from 'src/observation/dtos/observation-response-dto';

export class ExploratoryOfferObservationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ExploratoryOfferResponseDto)
  exploratory_offer: ExploratoryOfferResponseDto;

  @Expose()
  @Type(() => ObservationResponseDto)
  observation: ObservationResponseDto;
}
