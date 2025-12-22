import { Expose } from 'class-transformer';
import { RoleEnum } from 'src/enums';

export class CommercialEntityResponseDto {
  @Expose()
  id: number;

  @Expose()
  entity_name: string;

  @Expose()
  entity_country: string;

  @Expose()
  roles: RoleEnum[];//CommercialEntityRoleResponseDto[]; // Roles asignados a la entidad
}
