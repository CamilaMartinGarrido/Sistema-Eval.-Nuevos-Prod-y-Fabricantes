import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EvaluationStateManufacturerEnum } from 'src/enums';

export class UpdateManufacturerStatusDto {
  @IsNumber()
  @IsOptional()
  maker_product_id?: number;

  @IsString()
  @IsOptional()
  start_date?: string;
  
  @IsEnum(EvaluationStateManufacturerEnum)
  @IsOptional()
  evaluation_state?: EvaluationStateManufacturerEnum;

  @IsString()
  @IsOptional()
  end_date?: string;

  @IsNumber()
  @IsOptional()
  evaluation_process_id?: number;
}
