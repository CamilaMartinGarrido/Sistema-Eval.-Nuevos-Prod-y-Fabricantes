import { IsOptional, IsString } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  client_name?: string;

  @IsString()
  @IsOptional()
  client_country?: string;
}
