import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { EvaluationStateManufacturerEnum } from 'src/enums';

export class CreateManufacturerStatusDto {
  @IsNumber()
  @IsNotEmpty()
  maker_product_id: number;

  @IsString()
  @IsNotEmpty()
  start_date: string;
  
  @IsEnum(EvaluationStateManufacturerEnum)
  @IsNotEmpty()
  evaluation_state: EvaluationStateManufacturerEnum;

  @IsString()
  @IsOptional()
  end_date?: string;

  @IsNumber()
  @IsOptional()
  evaluation_process_id?: number;
}
