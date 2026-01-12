import { Expose, Type } from 'class-transformer';
import { EvaluationProcessResponseDto } from 'src/evaluation_process/dtos/evaluation_process-response.dto';
import { StateIndustrialPurchasingEnum } from 'src/enums';
import { IndustrialPurchaseObservationResponseDto } from 'src/industrial_purchase_observation/dtos/industrial_purchase_observation-response.dto';

export class IndustrialPurchaseResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => EvaluationProcessResponseDto)
  evaluation_process: EvaluationProcessResponseDto;

  @Expose()
  request_date: string;
  
  @Expose()
  purchase_status: StateIndustrialPurchasingEnum;

  @Expose()
  @Type(() => IndustrialPurchaseObservationResponseDto)
  industrial_purchase_observs: IndustrialPurchaseObservationResponseDto[];
}
