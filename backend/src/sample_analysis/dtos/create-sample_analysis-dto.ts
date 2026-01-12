import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateSampleAnalysisDto {
  @IsNumber()
  @IsNotEmpty()
  sample_id: number;

  @IsNumber()
  @IsNotEmpty()
  performed_by_client: number;

  @IsString()
  @IsOptional()
  analysis_date?: string;

  @IsString()
  @IsOptional()
  analysis_name?: string;

  @IsString()
  @IsOptional()
  analysis_result_details?: string;

  @IsString()
  @IsOptional()
  raw_data_path?: string;
}
