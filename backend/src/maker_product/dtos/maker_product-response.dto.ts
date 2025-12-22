import { Expose, Type } from 'class-transformer';
import { CommercialEntityLightDto } from 'src/commercial_entity/dtos';
import { ProductResponseDto } from "src/product/dtos/product-response-dto";

export class MakerProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;

  @Expose()
  @Type(() => CommercialEntityLightDto)
  maker_entity: CommercialEntityLightDto;
}
