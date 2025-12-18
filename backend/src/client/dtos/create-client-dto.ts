import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsString()
  @IsNotEmpty()
  client_country: string;
}
