import { Expose } from 'class-transformer';

export class ClientResponseDto {
  @Expose()
  id: number;

  @Expose()
  client_name: string;

  @Expose()
  client_country: string;
}
