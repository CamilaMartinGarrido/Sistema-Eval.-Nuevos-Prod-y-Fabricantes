import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { ResultSampleAnalysisEnum } from 'src/enums';

export class CreateSampleAnalysisDto {
  @IsNumber()
  @IsNotEmpty()
  sample_id: number;

  @IsNumber()
  @IsNotEmpty()
  performed_by_client: number;

  @IsString()
  @IsNotEmpty()
  analysis_date: string;

  @IsEnum(ResultSampleAnalysisEnum)
  @IsNotEmpty()
  result: ResultSampleAnalysisEnum;
}
