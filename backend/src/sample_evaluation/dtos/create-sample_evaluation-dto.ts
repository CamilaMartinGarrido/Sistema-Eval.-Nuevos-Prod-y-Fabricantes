import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSampleEvaluationDto {
  @IsNumber()
  @IsNotEmpty()
  client_supply_id: number;

  @IsNumber()
  @IsNotEmpty()
  sample_analysis_id: number;

  @IsBoolean()
  @IsNotEmpty()
  self_performed: boolean;

  @IsNumber()
  @IsOptional()
  source_client?: number;

  @IsString()
  @IsNotEmpty()
  evaluation_date: string;

  @IsBoolean()
  @IsNotEmpty()
  decision_continue: boolean;
}
