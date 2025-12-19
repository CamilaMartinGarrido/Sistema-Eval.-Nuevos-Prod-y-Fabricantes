import { Expose, Type } from 'class-transformer';
import { ClientResponseDto } from 'src/client/dtos/client-response-dto';
import { ProductResponseDto } from 'src/product/dtos/product-response-dto';
import { OriginRequestEnum } from 'src/enums';

export class ApplicationResponseDto {
  @Expose()
  id: number;

  @Expose()
  application_number: number;

  @Expose()
  origin: OriginRequestEnum; // devolver enum directamente

  @Expose()
  receipt_date: string;

  @Expose()
  is_selected: boolean;

  @Expose()
  @Type(() => ClientResponseDto)
  client: ClientResponseDto;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}
