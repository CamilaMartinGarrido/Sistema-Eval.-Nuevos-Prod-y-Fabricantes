import { Expose, Transform } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ obj }) => obj.description)
  product_description: string;

  @Expose()
  product_type: string;

  @Expose()
  @Transform(({ obj }) => obj.classification)
  product_classification: string;

  @Expose()
  exclusive_use: boolean;

  @Expose()
  @Transform(({ obj }) => obj.priority)
  product_priority: number;

  @Expose()
  created_at_Product: Date;
}
