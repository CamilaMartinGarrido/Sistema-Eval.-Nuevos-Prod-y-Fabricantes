import { Expose, Type } from 'class-transformer';
import { EvaluationProcessResponseDto } from 'src/evaluation_process/dtos/evaluation_process-response.dto';
import { SupplierPurchaseResponseDto } from 'src/supplier_purchase/dtos/supplier_purchase-response.dto';
import { ExploratoryOfferObservationResponseDto } from 'src/exploratory_offer_observation/dtos/exploratory_offer_observation-response.dto';

export class ExploratoryOfferResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => EvaluationProcessResponseDto)
  evaluation_process: EvaluationProcessResponseDto;

  @Expose()
  offered_price: string;
      
  @Expose()
  @Type(() => SupplierPurchaseResponseDto)
  reference_purchase: SupplierPurchaseResponseDto;

  @Expose()
  price_difference: string;

  @Expose()
  percentage_difference: string;

  @Expose()
  analysis_date: string;

  @Expose()
  is_competitive: boolean;

  @Expose()
  @Type(() => ExploratoryOfferObservationResponseDto)
  exploratory_offer_observs: ExploratoryOfferObservationResponseDto[];
}
