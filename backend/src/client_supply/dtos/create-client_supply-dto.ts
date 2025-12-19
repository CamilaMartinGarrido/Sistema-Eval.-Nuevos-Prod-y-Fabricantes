import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateClientSupplyDto {
  @IsNumber()
  @IsNotEmpty()
  client_id: number;

  @IsNumber()
  @IsNotEmpty()
  supply_id: number;

  @IsNumber()
  @IsNotEmpty()
  application_id: number;
}
