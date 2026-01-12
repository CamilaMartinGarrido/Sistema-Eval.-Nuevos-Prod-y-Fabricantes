import { Expose, Type } from 'class-transformer';
import { FinalStateManufacturerEnum } from 'src/enums';
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
  final_state: FinalStateManufacturerEnum;
  
  @Expose()
  end_date: string;
}
