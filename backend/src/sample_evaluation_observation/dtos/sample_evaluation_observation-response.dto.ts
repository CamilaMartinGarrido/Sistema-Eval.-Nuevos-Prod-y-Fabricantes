import { Expose, Type } from 'class-transformer';
import { SampleEvaluationResponseDto } from 'src/sample_evaluation/dtos/sample_evaluation-response.dto';
import { ObservationResponseDto } from 'src/observation/dtos/observation-response-dto';

export class SampleEvaluationObservationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => SampleEvaluationResponseDto)
  sample_evaluation: SampleEvaluationResponseDto;

  @Expose()
  @Type(() => ObservationResponseDto)
  observation: ObservationResponseDto;
}
