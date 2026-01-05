import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { ResultIndustrialAnalysisEnum } from 'src/enums';

export class CreateIndustrialEvaluationDto {
  @IsNumber()
  @IsNotEmpty()
  industrial_purchase_id: number;

  @IsString()
  @IsNotEmpty()
  send_batch_date: string;

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
