import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMakerProductDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  maker_id: number;
}
