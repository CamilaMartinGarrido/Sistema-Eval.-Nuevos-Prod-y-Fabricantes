import { Expose } from 'class-transformer';

export class CommercialEntityLightDto {
  @Expose()
  id: number;

  @Expose()
  entity_name: string;

  @Expose()
  entity_country: string;
}
