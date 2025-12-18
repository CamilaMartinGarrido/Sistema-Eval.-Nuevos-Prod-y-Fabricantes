import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierEntity } from './supplier.entity';
import { CreateSupplierDto, SupplierResponseDto, UpdateSupplierDto } from './dtos';
import { CommercialEntityService } from 'src/commercial_entity/commercial_entity.service';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,

    @Inject(forwardRef(() => CommercialEntityService))
    private readonly ceService: CommercialEntityService,
  ) {}

  async create(dto: CreateSupplierDto): Promise<{ message: string; data: SupplierEntity }> {
    let commercialEntity;

    // Caso 1: se pasa el ID de la entidad comercial
    if (dto.commercial_entity_id) {
      commercialEntity = await this.ceService.findOne(dto.commercial_entity_id);
      
      if (!commercialEntity) {
        throw new NotFoundException('Commercial entity not found');
      }

    // Caso 2: se pasan los datos de la entidad comercial
    } else if (dto.commercial_entity) {
      // Buscar si ya existe para evitar duplicados
      commercialEntity = await this.ceService.findByNameAndCountry(
        dto.commercial_entity.entity_name,
        dto.commercial_entity.entity_country
      );

      if (!commercialEntity) {
        const result = await this.ceService.create(dto.commercial_entity);
        commercialEntity = result.data;
      }
    } else {
      throw new NotFoundException('Commercial entity data is required');
    }
    
    // Crear el Supplier
    const supplier = this.supplierRepository.create({ commercial_entity: commercialEntity });
    const created = await this.supplierRepository.save(supplier);

    return {
      message: 'Supplier created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0): Promise<SupplierResponseDto[]> {
      const suppliers = await this.supplierRepository.find({ take: limit, skip: offset });
  
      return Promise.all(
        suppliers.map((supplier) => this.toResponseDto(supplier))
      );
    }

  async findOne(id: number): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
  
    return this.toResponseDto(supplier)
  }
  
  private async toResponseDto(entity: SupplierEntity): Promise<SupplierResponseDto> {
    return toDto(SupplierResponseDto, entity);
  }

  async update(id: number, dto: UpdateSupplierDto) {
    const supplier = await this.supplierRepository.findOneBy({ id });
    if (!supplier) throw new NotFoundException('Supplier not found');
  
    // Si se pasa un id de entidad comercial → asignar la entidad
    if (dto.commercial_entity_id) {
      const commercial = await this.ceService.findOne(dto.commercial_entity_id);
  
      // IMPORTANTE: asignar la entidad, NO el Promise
      (supplier as any).commercial_entity = commercial;
    }
  
    // Si se pasan datos de la entidad comercial → actualizamos la asociada
    if (dto.commercial_entity) {
      const commercial = await supplier.commercial_entity; // resolver lazy
      await this.ceService.update(commercial.id, dto.commercial_entity);
    }
  
    await this.supplierRepository.save(supplier);
    return { message: 'Supplier updated successfully' };
  }

  async remove(id: number) {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');

    await this.supplierRepository.remove(supplier);
    return { message: 'Supplier deleted successfully' };
  }
}
