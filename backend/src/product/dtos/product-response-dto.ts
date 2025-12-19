import { Expose, Transform } from 'class-transformer';
import { ProductTypeEnum } from 'src/enums';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ obj }) => obj.description)
  product_description: string;

  @Expose()
  product_type: ProductTypeEnum; // devolver enum directamente

  @Expose()
  @Transform(({ obj }) => obj.classification)
  product_classification: string;

  @Expose()
  exclusive_use: boolean;

  @Expose()
  @Transform(({ obj }) => obj.priority)
  product_priority: number;
}
