import { Expose, Type } from 'class-transformer';
import { SampleAnalysisResponseDto } from 'src/sample_analysis/dtos/sample_analysis-response.dto';
import { ObservationResponseDto } from 'src/observation/dtos/observation-response-dto';

export class SampleAnalysisObservationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => SampleAnalysisResponseDto)
  sample_analysis: SampleAnalysisResponseDto;

  @Expose()
  @Type(() => ObservationResponseDto)
  observation: ObservationResponseDto;
}
