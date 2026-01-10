import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { FinalStateManufacturerEnum } from 'src/enums';

export class UpdateManufacturerStatusDto {
  @IsNumber()
  @IsOptional()
  maker_product_id?: number;

  @IsString()
  @IsOptional()
  start_date?: string;
  
  @IsEnum(FinalStateManufacturerEnum)
  @IsOptional()
  final_state?: FinalStateManufacturerEnum;

  @IsString()
  @IsOptional()
  end_date?: string;
}
