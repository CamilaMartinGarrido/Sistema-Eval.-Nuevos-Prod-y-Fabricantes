import { Expose, Transform, Type } from 'class-transformer';
import { MakerResponseDto } from "src/maker/dtos/maker-response-dto";
import { ProductResponseDto } from "src/product/dtos/product-response-dto";

export class MakerProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  created_at_MakerProduct: Date;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;

  @Expose()
  @Type(() => MakerResponseDto)
  maker: MakerResponseDto;
}
