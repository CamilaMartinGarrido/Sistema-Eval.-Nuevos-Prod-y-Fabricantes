import { Expose, Transform, Type } from 'class-transformer';
import { CommercialEntityResponseDto } from "src/commercial_entity/dtos/commercial_entity-response-dto";
import { toDto } from 'src/common/utils/mapper.util';

export class SupplierResponseDto {
  @Expose()
  id: number;

  @Expose()
  created_at_Supplier: Date;

  @Expose()
  @Type(() => CommercialEntityResponseDto)
  commercial_entity: CommercialEntityResponseDto;
}
