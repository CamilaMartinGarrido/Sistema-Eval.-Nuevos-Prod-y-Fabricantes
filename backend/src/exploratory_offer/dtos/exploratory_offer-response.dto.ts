import { Expose, Type } from 'class-transformer';
import { SupplyResponseDto } from 'src/supply/dtos/supply-response.dto';
import { SupplierPurchaseResponseDto } from 'src/supplier_purchase/dtos/supplier_purchase-response.dto';
import { ExploratoryOfferObservationResponseDto } from 'src/exploratory_offer_observation/dtos/exploratory_offer_observation-response.dto';


export class ExploratoryOfferResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => SupplyResponseDto)
  supply: SupplyResponseDto;

  @Expose()
  offered_price: number;
      
  @Expose()
  @Type(() => SupplierPurchaseResponseDto)
  reference_purchase: SupplierPurchaseResponseDto;

  @Expose()
  analysis_date: string;

  @Expose()
  @Type(() => ExploratoryOfferObservationResponseDto)
  exploratory_offer_observs: ExploratoryOfferObservationResponseDto[];
}
