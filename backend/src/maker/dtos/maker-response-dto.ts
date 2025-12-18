import { Expose, Type } from 'class-transformer';
import { CommercialEntityResponseDto } from "src/commercial_entity/dtos/commercial_entity-response-dto";

export class MakerResponseDto {
  @Expose()
  id: number;

  @Expose()
  created_at_Maker: Date;

  @Expose()
  @Type(() => CommercialEntityResponseDto)
  commercial_entity: CommercialEntityResponseDto;
}
