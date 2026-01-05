import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ResultIndustrialAnalysisEnum } from 'src/enums';

export class UpdateIndustrialEvaluationDto {
  @IsNumber()
  @IsOptional()
  industrial_purchase_id?: number;

  @IsString()
  @IsOptional()
  send_batch_date?: string;

  @IsString()
  @IsOptional()
  reception_batch_date?: string;
  
  @IsEnum(ResultIndustrialAnalysisEnum)
  @IsOptional()
  analysis_result?: ResultIndustrialAnalysisEnum;

  @IsString()
  @IsOptional()
  report_delivery_date?: string;
}
