import { Expose, Type } from 'class-transformer';
import { ResultSampleEvaluationEnum } from 'src/enums';
import { EvaluationProcessResponseDto } from 'src/evaluation_process/dtos/evaluation_process-response.dto';
import { SampleAnalysisResponseDto } from 'src/sample_analysis/dtos/sample_analysis-response.dto';
import { SampleEvaluationObservationResponseDto } from 'src/sample_evaluation_observation/dtos/sample_evaluation_observation-response.dto';

export class SampleEvaluationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => EvaluationProcessResponseDto)
  evaluation_process: EvaluationProcessResponseDto;

  @Expose()
  @Type(() => SampleAnalysisResponseDto)
  sample_analysis: SampleAnalysisResponseDto;

  @Expose()
  self_performed: boolean;
  
  @Expose()
  send_analysis_date: string;

  @Expose()
  evaluation_date: string;

  @Expose()
  result: ResultSampleEvaluationEnum;

  @Expose()
  decision_continue: boolean;

  @Expose()
  @Type(() => SampleEvaluationObservationResponseDto)
  sample_evaluation_observs: SampleEvaluationObservationResponseDto;
}
