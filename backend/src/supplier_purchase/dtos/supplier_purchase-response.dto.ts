import { Expose, Type } from 'class-transformer';
import { CommercialEntityResponseDto } from 'src/commercial_entity/dtos/commercial_entity-response-dto';
import { ProductResponseDto } from 'src/product/dtos/product-response-dto';

export class SupplierPurchaseResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;

  @Expose()
  @Type(() => CommercialEntityResponseDto)
  supplier: CommercialEntityResponseDto;

  @Expose()
  unit_price: number;
      
  @Expose()
  purchase_date: string;
}
