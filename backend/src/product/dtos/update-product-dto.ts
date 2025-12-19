import { ProductTypeEnum } from 'src/enums';
import { IsOptional, IsNumber, IsString, IsEnum, IsBoolean } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProductTypeEnum)
  @IsOptional()
  product_type?: ProductTypeEnum;

  @IsString()
  @IsOptional()
  classification?: string;

  @IsNumber()
  @IsOptional()
  priority?: number;

  @IsBoolean()
  @IsOptional()
  exclusive_use?: boolean;
}
