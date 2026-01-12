import { Expose, Type } from 'class-transformer';
import { ClientResponseDto } from 'src/client/dtos/client-response-dto';
import { SampleResponseDto } from 'src/sample/dtos/sample-response.dto';
import { SampleAnalysisObservationResponseDto } from 'src/sample_analysis_observation/dtos/sample_analysis_observation-response.dto';

export class SampleAnalysisResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => SampleResponseDto)
  sample: SampleResponseDto;

  @Expose()
  @Type(() => ClientResponseDto)
  performed_by_client: ClientResponseDto;
  
  @Expose()
  analysis_date: string;
  
  @Expose()
  analysis_name: string;

  @Expose()
  analysis_result_details: string;

  @Expose()
  raw_data_path: string;

  @Expose()
  @Type(() => SampleAnalysisObservationResponseDto)
  sample_analysis_observs: SampleAnalysisObservationResponseDto[];
}
