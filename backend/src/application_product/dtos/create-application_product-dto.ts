import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateApplicationProductDto {
  @IsNumber()
  @IsNotEmpty()
  application_id: number;

  @IsNumber()
  @IsNotEmpty()
  product_id: number;
}
