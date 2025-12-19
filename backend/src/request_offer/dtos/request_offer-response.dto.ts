import { Expose, Type } from 'class-transformer';
import { ApplicationResponseDto } from 'src/application/dtos/application-response.dto';
import { ExploratoryOfferResponseDto } from 'src/exploratory_offer/dtos/exploratory_offer-response.dto';

export class RequestOfferResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ApplicationResponseDto)
  application:ApplicationResponseDto;

  @Expose()
  @Type(() => ExploratoryOfferResponseDto)
  exploratory_offer: ExploratoryOfferResponseDto;
}
