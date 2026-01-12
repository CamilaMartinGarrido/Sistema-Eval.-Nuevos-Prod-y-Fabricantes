import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSampleAnalysisDto {
  @IsNumber()
  @IsOptional()
  sample_id?: number;

  @IsNumber()
  @IsOptional()
  performed_by_client?: number;

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
