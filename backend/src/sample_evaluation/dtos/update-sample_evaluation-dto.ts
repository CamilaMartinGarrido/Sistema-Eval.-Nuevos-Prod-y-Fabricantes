import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ResultSampleEvaluationEnum } from 'src/enums';

export class UpdateSampleEvaluationDto {
  @IsNumber()
  @IsOptional()
  evaluation_process_id?: number;
  
  @IsNumber()
  @IsOptional()
  sample_analysis_id?: number;
  
  @IsBoolean()
  @IsOptional()
  self_performed?: boolean;
  
  @IsString()
  @IsOptional()
  send_analysis_date?: string;

  @IsString()
  @IsOptional()
  evaluation_date?: string;

  @IsEnum(ResultSampleEvaluationEnum)
  @IsOptional()
  result?: ResultSampleEvaluationEnum;

  @IsBoolean()
  @IsOptional()
  decision_continue?: boolean;
}
