import { Expose, Type } from "class-transformer";
import { ApplicationResponseDto } from "src/application/dtos/application-response.dto";
import { ArchiveReasonEnum, LifecycleStateEnum } from "src/enums";
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

  @Expose()
  lifecycle_state: LifecycleStateEnum;

  @Expose()
  archive_date: string;

  @Expose()
  archive_reason: ArchiveReasonEnum;
}
