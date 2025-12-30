import { Expose, Type } from 'class-transformer';
import { SupplyResponseDto } from 'src/supply/dtos/supply-response.dto';

export class SampleResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => SupplyResponseDto)
  supply: SupplyResponseDto;

  @Expose()
  request_date: string;
  
  @Expose()
  send_date_supplier: string;
  
  @Expose()
  date_receipt_warehouse: string;
  
  @Expose()
  date_receipt_client: string;
  
  @Expose()
  quantity: number;
  
  @Expose()
  unit: string;
  
  @Expose()
  sample_code: string;
}
