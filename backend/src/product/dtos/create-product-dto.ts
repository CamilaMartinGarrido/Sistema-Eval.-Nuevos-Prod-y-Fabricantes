import { ProductTypeEnum } from 'src/enums';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  product_type: ProductTypeEnum;

  @IsString()
  @IsNotEmpty()
  classification: string;

  @IsNumber()
  @IsNotEmpty()
  priority: number;
}
