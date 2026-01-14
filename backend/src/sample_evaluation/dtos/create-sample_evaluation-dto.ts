import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ResultSampleEvaluationEnum } from 'src/enums';

export class CreateSampleEvaluationDto {
  @IsNumber()
  @IsNotEmpty()
  evaluation_process_id: number;

  @IsNumber()
  @IsNotEmpty()
  sample_analysis_id: number;

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
