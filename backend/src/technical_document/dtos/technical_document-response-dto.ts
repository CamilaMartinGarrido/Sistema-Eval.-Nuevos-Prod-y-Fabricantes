import { Expose, Type } from 'class-transformer';
import { SupplyResponseDto } from 'src/supply/dtos/supply-response.dto';

export class TechnicalDocumentResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => SupplyResponseDto)
  supply: SupplyResponseDto;

  @Expose()
  document_type: string;

  @Expose()
  version: string;

  @Expose()
  request_date: string;

  @Expose()
  receipt_date: string;
}
