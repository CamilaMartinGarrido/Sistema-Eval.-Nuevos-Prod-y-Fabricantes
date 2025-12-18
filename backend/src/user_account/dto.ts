import { UserRoleEnum } from 'src/enums';

export class CreateUserAccountDto {
  username: string;
  password: string;
  role: UserRoleEnum;
}
