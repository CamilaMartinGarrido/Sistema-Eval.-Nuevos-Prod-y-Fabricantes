import { Expose } from 'class-transformer';
import { EntityRoleEnum } from 'src/enums';

export class CommercialEntityResponseDto {
  @Expose()
  id: number;

  @Expose()
  entity_name: string;

  @Expose()
  entity_country: string;

  @Expose()
  roles: EntityRoleEnum[];//CommercialEntityRoleResponseDto[]; // Roles asignados a la entidad
}
