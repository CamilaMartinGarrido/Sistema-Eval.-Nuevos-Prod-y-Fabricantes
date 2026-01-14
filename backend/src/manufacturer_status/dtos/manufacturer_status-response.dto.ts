import { Expose, Type } from 'class-transformer';
import { EvaluationStateManufacturerEnum } from 'src/enums';
import { EvaluationProcessResponseDto } from 'src/evaluation_process/dtos';
import { MakerProductResponseDto } from 'src/maker_product/dtos/maker_product-response.dto';

export class ManufacturerStatusResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => MakerProductResponseDto)
  maker_product: MakerProductResponseDto;
  
  @Expose()
  start_date: string;
    
  @Expose()
  final_state: EvaluationStateManufacturerEnum;
  
  @Expose()
  end_date: string;

  @Expose()
  @Type(() => EvaluationProcessResponseDto)
  evaluation_process: EvaluationProcessResponseDto;
}
