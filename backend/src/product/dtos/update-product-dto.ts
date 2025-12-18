import { ProductTypeEnum } from 'src/enums';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  product_type?: ProductTypeEnum;

  @IsString()
  @IsOptional()
  classification?: string;

  @IsNumber()
  @IsOptional()
  priority?: number;
}
