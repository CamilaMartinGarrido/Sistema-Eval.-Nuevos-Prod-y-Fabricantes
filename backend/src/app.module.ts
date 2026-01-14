import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ApplicationModule } from './application/application.module';
import { ApplicationProductModule } from './application_product';
import { ClientModule } from './client/client.module';
import { CommercialEntityModule } from './commercial_entity/commercial_entity.module';
import { DocumentEvaluationModule } from './document_evaluation/document_evaluation.module';
import { DocumentEvaluationObservationModule } from './document_evaluation_observation';
import { EvaluationProcessModule } from './evaluation_process/evaluation_process.module';
import { ExploratoryOfferModule } from './exploratory_offer/exploratory_offer.module';
import { ExploratoryOfferObservationModule } from './exploratory_offer_observation/exploratory_offer_observation.module';
import { IndustrialEvaluationModule } from './industrial_evaluation/industrial_evaluation.module';
import { IndustrialEvaluationObservationModule } from './industrial_evaluation_observation/industrial_evaluation_observation.module';
import { IndustrialPurchaseModule } from './industrial_purchase/industrial_purchase.module';
import { IndustrialPurchaseObservationModule } from './industrial_purchase_observation/industrial_purchase_observation.module';
import { MakerProductModule } from './maker_product/maker_product.module';
import { ManufacturerStatusModule } from './manufacturer_status/manufacturer_status.module';
import { ObservationModule } from './observation/observation.module';
import { ProductModule } from './product/product.module';
import { RequestObservationModule } from './request_observation/request_observation.module';
import { SampleModule } from './sample/sample.module';
import { SampleAnalysisModule } from './sample_analysis/sample_analysis.module';
import { SampleAnalysisObservationModule } from './sample_analysis_observation/sample_analysis_observation.module';
import { SampleEvaluationModule } from './sample_evaluation/sample_evaluation.module';
import { SampleEvaluationObservationModule } from './sample_evaluation_observation/sample_evaluation_observation.module';
import { SupplierPurchaseModule } from './supplier_purchase/supplier_purchase.module';
import { SupplyModule } from './supply/supply.module';
import { TechnicalDocumentModule } from './technical_document/technical_document.module';
import { UserAccountModule } from './user_account/user_account.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: /*5432,*/ 5434,
      username: 'postgres',
      password: 'CamilaBD',
      database: 'Sistema Eval. Nuevos Prod y/o Fab',
      entities: [],
      autoLoadEntities: true,
      synchronize: false,
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ApplicationModule,
    ApplicationProductModule,
    ClientModule,
    CommercialEntityModule,
    DocumentEvaluationModule,
    DocumentEvaluationObservationModule,
    EvaluationProcessModule,
    ExploratoryOfferModule,
    ExploratoryOfferObservationModule,
    IndustrialEvaluationModule,
    IndustrialEvaluationObservationModule,
    IndustrialPurchaseModule,
    IndustrialPurchaseObservationModule,
    MakerProductModule,
    ManufacturerStatusModule,
    ObservationModule,
    ProductModule,
    RequestObservationModule,
    SampleModule,
    SampleAnalysisModule,
    SampleAnalysisObservationModule,
    SampleEvaluationModule,
    SampleEvaluationObservationModule,
    SupplierPurchaseModule,
    SupplyModule,
    TechnicalDocumentModule,
    UserAccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
