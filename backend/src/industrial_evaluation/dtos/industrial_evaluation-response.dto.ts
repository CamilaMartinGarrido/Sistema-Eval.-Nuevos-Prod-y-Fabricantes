import { Expose, Type } from 'class-transformer';
import { IndustrialPurchaseResponseDto } from 'src/industrial_purchase/dtos/industrial_purchase-response.dto';
import { ResultIndustrialAnalysisEnum } from 'src/enums';
import { IndustrialEvaluationObservationResponseDto } from 'src/industrial_evaluation_observation/dtos/industrial_evaluation_observation-response.dto';

export class IndustrialEvaluationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => IndustrialPurchaseResponseDto)
  industrial_purchase: IndustrialPurchaseResponseDto;

  @Expose()
  send_batch_date: string;

  @Expose()
  reception_batch_date: string;
  
  @Expose()
  analysis_result: ResultIndustrialAnalysisEnum;

  @Expose()
  report_delivery_date: string;

  @Expose()
  @Type(() => IndustrialEvaluationObservationResponseDto)
  industrial_evaluation_observs: IndustrialEvaluationObservationResponseDto[];
}
