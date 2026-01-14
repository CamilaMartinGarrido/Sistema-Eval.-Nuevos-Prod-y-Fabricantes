import { Expose, Type } from 'class-transformer';
import { ArchiveReasonEnum, LifecycleStateEnum, OriginRequestEnum } from 'src/enums';
import { ClientResponseDto } from 'src/client/dtos/client-response-dto';
import { ProductResponseDto } from 'src/product/dtos/product-response-dto';
import { RequestObservationResponseDto } from 'src/request_observation/dtos/request_observation-response.dto';

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
  lifecycle_state: LifecycleStateEnum;

  @Expose()
  archive_date: string;

  @Expose()
  archive_reason: ArchiveReasonEnum;

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
