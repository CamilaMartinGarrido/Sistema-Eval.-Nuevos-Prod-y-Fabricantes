import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { ProductTypeEnum } from '../enums';
import { ApplicationProductEntity } from '../application_product/application_product.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { SupplierPurchaseEntity } from '../supplier_purchase/supplier_purchase.entity';

@Unique(['description', 'product_type'])
@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  description: string;

  @Column({
    type: 'enum',
    enum: ProductTypeEnum,
    enumName: 'product_type_enum',
    nullable: false,
  })
  product_type: ProductTypeEnum;

  @Column({ type: 'boolean' })
  exclusive_use: boolean;

  @Column({ type: 'int' })
  priority: number;

  @OneToMany(() => ApplicationProductEntity, (app_product) => app_product.product)
  app_products: ApplicationProductEntity[];
  
  @OneToMany(() => MakerProductEntity, (maker_product) => maker_product.product)
  maker_products: MakerProductEntity[];

  @OneToMany(() => SupplierPurchaseEntity, supplier_purchase => supplier_purchase.product)
  supplier_purchases: SupplierPurchaseEntity[];
}
