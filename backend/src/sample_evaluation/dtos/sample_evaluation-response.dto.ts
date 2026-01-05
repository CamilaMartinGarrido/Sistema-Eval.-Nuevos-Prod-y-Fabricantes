import { Expose, Type } from 'class-transformer';
import { ClientResponseDto } from 'src/client/dtos/client-response-dto';
import { ClientSupplyResponseDto } from 'src/client_supply/dtos/client_supply-response.dto';
import { SampleAnalysisResponseDto } from 'src/sample_analysis/dtos/sample_analysis-response.dto';
import { SampleEvaluationObservationResponseDto } from 'src/sample_evaluation_observation/dtos/sample_evaluation_observation-response.dto';

export class SampleEvaluationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ClientSupplyResponseDto)
  client_supply: ClientSupplyResponseDto;

  @Expose()
  @Type(() => SampleAnalysisResponseDto)
  sample_analysis: SampleAnalysisResponseDto;

  @Expose()
  self_performed: boolean;
  
  @Expose()
  @Type(() => ClientResponseDto)
  source_client: ClientResponseDto;

  @Expose()
  evaluation_date: string;

  @Expose()
  decision_continue: boolean;

  @Expose()
  @Type(() => SampleEvaluationObservationResponseDto)
  sample_evaluation_observs: SampleEvaluationObservationResponseDto;
}
