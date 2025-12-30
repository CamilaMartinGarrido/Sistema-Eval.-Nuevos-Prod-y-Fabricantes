import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSampleEvaluationDto {
  @IsNumber()
  @IsOptional()
  client_supply_id?: number;
  
  @IsNumber()
  @IsOptional()
  sample_analysis_id?: number;
  
  @IsBoolean()
  @IsOptional()
  self_performed?: boolean;
  
  @IsNumber()
  @IsOptional()
  source_client?: number;
  
  @IsString()
  @IsOptional()
  evaluation_date?: string;
  
  @IsBoolean()
  @IsOptional()
  decision_continue?: boolean;
}
