import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { FinalStateManufacturerEnum } from 'src/enums';

export class CreateManufacturerStatusDto {
  @IsNumber()
  @IsNotEmpty()
  maker_product_id: number;

  @IsString()
  @IsNotEmpty()
  start_date: string;
  
  @IsEnum(FinalStateManufacturerEnum)
  @IsNotEmpty()
  final_state: FinalStateManufacturerEnum;

  @IsString()
  @IsNotEmpty()
  end_date: string;
}
