import { Expose } from 'class-transformer';

export class CommercialEntityResponseDto {
  @Expose()
  id: number;

  @Expose()
  entity_name: string;

  @Expose()
  entity_country: string;

  @Expose()
  created_at_CommercialEntity: Date;
}
