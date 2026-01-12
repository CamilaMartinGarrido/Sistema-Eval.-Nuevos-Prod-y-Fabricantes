import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEvaluationProcessDto {
  @IsNumber()
  @IsNotEmpty()
  application_id: number;

  @IsNumber()
  @IsNotEmpty()
  supply_id: number;
}
