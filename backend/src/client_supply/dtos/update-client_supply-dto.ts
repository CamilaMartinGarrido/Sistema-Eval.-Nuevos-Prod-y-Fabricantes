import { IsNumber, IsOptional } from 'class-validator';

export class UpdateClientSupplyDto {
  @IsNumber()
  @IsOptional()
  client_id?: number;

  @IsNumber()
  @IsOptional()
  supply_id?: number;
}
