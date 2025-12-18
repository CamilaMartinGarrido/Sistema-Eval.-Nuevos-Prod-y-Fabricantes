import { Expose, Transform, Type } from "class-transformer";
import { ClientResponseDto } from "src/client/dtos/client-response-dto";
import { SupplyResponseDto } from "src/supply/dtos";

export class ClientSupplyResponseDto {
  @Expose()
  id: number;

  @Expose()
  created_at_ClientSupply: Date;

  @Expose()
  @Type(() => ClientResponseDto)
  client: ClientResponseDto;

  @Expose()
  @Type(() => SupplyResponseDto)
  supply: SupplyResponseDto;
}
