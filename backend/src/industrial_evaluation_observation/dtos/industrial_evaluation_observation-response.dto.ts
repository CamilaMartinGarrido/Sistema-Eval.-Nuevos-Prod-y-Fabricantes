import { Expose, Type } from 'class-transformer';
import { ObservationResponseDto } from 'src/observation/dtos/observation-response-dto';
import { IndustrialEvaluationResponseDto } from 'src/industrial_evaluation/dtos/industrial_evaluation-response.dto';

export class IndustrialEvaluationObservationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => IndustrialEvaluationResponseDto)
  industrial_evaluation: IndustrialEvaluationResponseDto;

  @Expose()
  @Type(() => ObservationResponseDto)
  observation: ObservationResponseDto;
}
