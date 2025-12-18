import { Expose, Transform } from 'class-transformer';

export class ClientResponseDto {
  @Expose()
  id: number;

  @Expose()
  client_name: string;

  @Expose()
  client_country: string;

  @Expose()
  created_at_Client: Date;
}
