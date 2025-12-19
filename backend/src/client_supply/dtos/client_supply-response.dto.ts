import { Expose, Type } from "class-transformer";
import { ApplicationResponseDto } from "src/application/dtos/application-response.dto";
import { ClientResponseDto } from "src/client/dtos/client-response-dto";
import { SupplyResponseDto } from "src/supply/dtos/supply-response.dto";

export class ClientSupplyResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ClientResponseDto)
  client: ClientResponseDto;

  @Expose()
  @Type(() => SupplyResponseDto)
  supply: SupplyResponseDto;

  @Expose()
  @Type(() => ApplicationResponseDto)
  application: ApplicationResponseDto;
}
