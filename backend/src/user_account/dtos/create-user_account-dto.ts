import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/enums';

export class CreateUserAccountDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: UserRoleEnum;

  @IsString()
  @IsNotEmpty()
  full_name: string;
}
