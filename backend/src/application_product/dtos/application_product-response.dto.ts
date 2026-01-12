import { Expose, Type } from 'class-transformer';
import { ApplicationResponseDto } from 'src/application/dtos/application-response.dto';
import { ProductResponseDto } from 'src/product/dtos/product-response-dto';

export class ApplicationProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ApplicationResponseDto)
  application: ApplicationResponseDto;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}
