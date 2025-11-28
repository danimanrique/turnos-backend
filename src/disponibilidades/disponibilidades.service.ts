import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disponibilidad } from './entities/disponibilidad.entity';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
import { Recurso } from '../recursos/entities/recurso.entity';

@Injectable()
export class DisponibilidadesService {
  constructor(
    @InjectRepository(Disponibilidad)
    private readonly disponibilidadRepo: Repository<Disponibilidad>,
    @InjectRepository(Recurso)
    private readonly recursoRepo: Repository<Recurso>,
  ) {}

  async create(
    recursoId: number,
    dto: CreateDisponibilidadDto,
  ): Promise<Disponibilidad> {
    const recurso = await this.recursoRepo.findOne({ where: { id: recursoId } });
    if (!recurso) {
      throw new NotFoundException('Recurso no encontrado');
    }

    const disponibilidad = this.disponibilidadRepo.create({
      ...dto,
      recurso,
    });
    return this.disponibilidadRepo.save(disponibilidad);
  }

  findByRecurso(recursoId: number): Promise<Disponibilidad[]> {
    return this.disponibilidadRepo.find({
      where: { recurso: { id: recursoId }, estado: 'ACTIVA' },
      relations: ['recurso'],
    });
  }

  async findOne(id: number): Promise<Disponibilidad> {
    const disponibilidad = await this.disponibilidadRepo.findOne({
      where: { id },
      relations: ['recurso'],
    });
    if (!disponibilidad) {
      throw new NotFoundException('Disponibilidad no encontrada');
    }
    return disponibilidad;
  }

  async update(
    id: number,
    dto: UpdateDisponibilidadDto,
  ): Promise<Disponibilidad> {
    const disponibilidad = await this.findOne(id);
    Object.assign(disponibilidad, dto);
    return this.disponibilidadRepo.save(disponibilidad);
  }

  async remove(id: number): Promise<void> {
    const disponibilidad = await this.findOne(id);
    await this.disponibilidadRepo.softRemove(disponibilidad);
  }
}
