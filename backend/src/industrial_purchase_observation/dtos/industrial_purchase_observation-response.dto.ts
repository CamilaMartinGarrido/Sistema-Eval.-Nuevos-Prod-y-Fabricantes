import { Expose, Type } from 'class-transformer';
import { ObservationResponseDto } from 'src/observation/dtos/observation-response-dto';
import { IndustrialPurchaseResponseDto } from 'src/industrial_purchase/dtos/industrial_purchase-response.dto';

export class IndustrialPurchaseObservationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => IndustrialPurchaseResponseDto)
  industrial_purchase: IndustrialPurchaseResponseDto;

  @Expose()
  @Type(() => ObservationResponseDto)
  observation: ObservationResponseDto;
}
