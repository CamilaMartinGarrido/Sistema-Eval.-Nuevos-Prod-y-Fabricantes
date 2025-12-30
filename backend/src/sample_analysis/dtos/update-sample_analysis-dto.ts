import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ResultSampleAnalysisEnum } from 'src/enums';

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

  @IsEnum(ResultSampleAnalysisEnum)
  @IsOptional()
  result?: ResultSampleAnalysisEnum;
}
