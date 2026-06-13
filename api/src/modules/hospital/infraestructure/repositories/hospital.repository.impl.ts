import { Injectable } from '@nestjs/common';
import { HospitalRepository } from '../../domain/repositories/hospital.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { HospitalOrmEntity } from '../orm/hospital-orm-entity';
import { Repository } from 'typeorm';
import { Hospital } from '../../domain/entities/hospital.entity';

@Injectable()
export class HospitalRepositoryImpl implements HospitalRepository {
  constructor(
    @InjectRepository(HospitalOrmEntity)
    private readonly repository: Repository<HospitalOrmEntity>,
  ) {}

  async create(hospital: Hospital): Promise<Hospital> {
    const entity = this.repository.create({
      nome: hospital.nome,
      cnpj: hospital.cnpj,
      endereco: hospital.endereco,
    });

    const saved = await this.repository.save(entity);

    return new Hospital(saved.id, saved.nome, saved.cnpj, saved.endereco);
  }

  async findAll(): Promise<Hospital[]> {
    const hospitals = await this.repository.find();

    return hospitals.map((h) => new Hospital(h.id, h.nome, h.cnpj, h.endereco));
  }

  async findById(id: number): Promise<Hospital | null> {
    const hospital = await this.repository.findOne({
      where: { id },
    });

    if (!hospital) {
      return null;
    }

    return new Hospital(
      hospital.id,
      hospital.nome,
      hospital.cnpj,
      hospital.endereco,
    );
  }

  async update(hospital: Hospital): Promise<Hospital> {
    if (hospital.id === null) {
      throw new Error('Hospital id is required to update');
    }

    await this.repository.update(hospital.id, {
      nome: hospital.nome,
      cnpj: hospital.cnpj,
      endereco: hospital.endereco,
    });

    return hospital;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
