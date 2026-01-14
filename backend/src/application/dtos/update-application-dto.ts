import { ArchiveReasonEnum, LifecycleStateEnum, OriginRequestEnum } from 'src/enums';
import { IsBoolean, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateApplicationDto {
  @IsNumber()
  @IsOptional()
  application_number?: number;

  @IsNumber()
  @IsOptional()
  client_id?: number;

  @IsEnum(OriginRequestEnum)
  @IsOptional()
  origin?: OriginRequestEnum;

  @IsString()
  @IsOptional()
  receipt_date?: string;

  @IsBoolean()
  @IsOptional()
  is_selected?: boolean;

  @IsEnum(LifecycleStateEnum)
  @IsOptional()
  lifecycle_state?: LifecycleStateEnum;

  @IsString()
  @IsOptional()
  archive_date?: string;

  @IsEnum(ArchiveReasonEnum)
  @IsOptional()
  archive_reason?: ArchiveReasonEnum;
}
