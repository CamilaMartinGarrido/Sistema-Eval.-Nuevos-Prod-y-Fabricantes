import { Expose, Type } from 'class-transformer';
import { ClientSupplyResponseDto } from 'src/client_supply/dtos/client_supply-response.dto';
import { StateIndustrialPurchasingEnum } from 'src/enums';
import { IndustrialPurchaseObservationResponseDto } from 'src/industrial_purchase_observation/dtos/industrial_purchase_observation-response.dto';

export class IndustrialPurchaseResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ClientSupplyResponseDto)
  client_supply: ClientSupplyResponseDto;

  @Expose()
  request_date: string;
  
  @Expose()
  purchase_status: StateIndustrialPurchasingEnum;

  @Expose()
  @Type(() => IndustrialPurchaseObservationResponseDto)
  industrial_purchase_observs: IndustrialPurchaseObservationResponseDto[];
}
