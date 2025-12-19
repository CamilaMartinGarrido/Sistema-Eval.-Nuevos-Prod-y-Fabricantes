import { Expose, Type } from 'class-transformer';
import { CommercialEntityLightDto } from 'src/commercial_entity/dtos/commercial_entity_light-response.dto';
import { MakerProductResponseDto } from "src/maker_product/dtos/maker_product-response.dto";

export class SupplyResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => CommercialEntityLightDto)
  supplier_entity: CommercialEntityLightDto;

  @Expose()
  @Type(() => MakerProductResponseDto)
  maker_product: MakerProductResponseDto;
}
