import { ProductTypeEnum } from 'src/enums';
import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ProductTypeEnum)
  @IsNotEmpty()
  product_type: ProductTypeEnum;

  @IsNumber()
  @IsNotEmpty()
  priority: number;

  @IsNotEmpty()
  exclusive_use: boolean;
}
