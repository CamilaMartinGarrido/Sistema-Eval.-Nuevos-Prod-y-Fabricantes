import { Expose, Type } from "class-transformer";
import { ApplicationResponseDto } from "src/application/dtos/application-response.dto";
import { SupplyResponseDto } from "src/supply/dtos/supply-response.dto";

export class EvaluationProcessResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ApplicationResponseDto)
  application: ApplicationResponseDto;

  @Expose()
  @Type(() => SupplyResponseDto)
  supply: SupplyResponseDto;
}
