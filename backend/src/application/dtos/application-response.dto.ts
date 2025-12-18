import { Expose, Transform, Type } from 'class-transformer';
import { ClientResponseDto } from "src/client/dtos/client-response-dto";
import { ProductResponseDto } from "src/product/dtos/product-response-dto";

export class ApplicationResponseDto {
  @Expose()
  id: number;

  @Expose()
  application_number: number;

  @Expose()
  origin: string;

  @Expose()
  receipt_date: string;

  @Expose()
  is_selected: boolean;

  @Expose()
  created_at_Application: Date;

  @Expose()
  @Type(() => ClientResponseDto)
  client: ClientResponseDto;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}
