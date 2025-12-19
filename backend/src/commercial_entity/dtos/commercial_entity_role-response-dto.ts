import { Expose } from 'class-transformer';
import { RoleEnum } from 'src/enums';

export class CommercialEntityRoleResponseDto {
  @Expose()
  id: number;

  @Expose()
  role_type: RoleEnum;
}
