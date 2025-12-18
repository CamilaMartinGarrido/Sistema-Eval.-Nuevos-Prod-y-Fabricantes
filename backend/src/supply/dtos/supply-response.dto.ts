import { Expose, Type } from 'class-transformer';
import { MakerProductResponseDto } from "src/maker_product/dtos/maker_product-response.dto";
import { SupplierResponseDto } from "src/supplier/dtos/supplier-response-dto";

export class SupplyResponseDto {
  @Expose()
  id: number;

  @Expose()
  created_at_Supply: Date;

  @Expose()
  @Type(() => SupplierResponseDto)
  supplier: SupplierResponseDto;

  @Expose()
  @Type(() => MakerProductResponseDto)
  maker_product: MakerProductResponseDto;
}
