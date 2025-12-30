import { Expose, Type } from 'class-transformer';
import { ClientResponseDto } from 'src/client/dtos/client-response-dto';
import { ProductResponseDto } from 'src/product/dtos/product-response-dto';
import { OriginRequestEnum } from 'src/enums';
import { RequestObservationResponseDto } from 'src/request_observation/dtos';

export class ApplicationResponseDto {
  @Expose()
  id: number;

  @Expose()
  application_number: number;

  @Expose()
  origin: OriginRequestEnum;

  @Expose()
  receipt_date: string;

  @Expose()
  is_selected: boolean;

  @Expose()
  @Type(() => ClientResponseDto)
  client: ClientResponseDto;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;

  @Expose()
  @Type(() => RequestObservationResponseDto)
  request_observs: RequestObservationResponseDto[];
}
