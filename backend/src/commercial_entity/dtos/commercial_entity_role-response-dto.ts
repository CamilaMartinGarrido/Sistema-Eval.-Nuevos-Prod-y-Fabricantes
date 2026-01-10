import { Expose } from 'class-transformer';
import { EntityRoleEnum } from 'src/enums';

export class CommercialEntityRoleResponseDto {
  @Expose()
  id: number;

  @Expose()
  role_type: EntityRoleEnum;
}
