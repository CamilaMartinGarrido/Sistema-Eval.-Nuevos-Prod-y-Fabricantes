import { IsNumber, IsOptional } from 'class-validator';

export class UpdateEvaluationProcessDto {
  @IsNumber()
  @IsOptional()
  application_id?: number;

  @IsNumber()
  @IsOptional()
  supply_id?: number;
}
