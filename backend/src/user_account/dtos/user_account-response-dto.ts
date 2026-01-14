import { Expose } from 'class-transformer';
import { UserRoleEnum } from 'src/enums';

export class UserAccountResponseDto {
  @Expose()
  username: string;

  @Expose()
  role: UserRoleEnum;

  @Expose()
  full_name: string;

  @Expose()
  is_active: boolean;
}
