import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/enums';

export class UpdateUserAccountDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role?: UserRoleEnum;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
