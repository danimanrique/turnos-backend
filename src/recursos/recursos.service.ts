import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recurso } from './entities/recurso.entity';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { UpdateRecursoDto } from './dto/update-recurso.dto';

@Injectable()
export class RecursosService {
  constructor(
    @InjectRepository(Recurso)
    private readonly recursosRepo: Repository<Recurso>,
  ) {}

  async create(dto: CreateRecursoDto): Promise<Recurso> {
    const recurso = this.recursosRepo.create(dto);
    return this.recursosRepo.save(recurso);
  }

  findAll(): Promise<Recurso[]> {
    return this.recursosRepo.find();
  }

  async findOne(id: number): Promise<Recurso> {
    const recurso = await this.recursosRepo.findOne({ where: { id } });
    if (!recurso) {
      throw new NotFoundException('Recurso no encontrado');
    }
    return recurso;
  }

  async update(id: number, dto: UpdateRecursoDto): Promise<Recurso> {
    const recurso = await this.findOne(id);
    Object.assign(recurso, dto);
    return this.recursosRepo.save(recurso);
  }

  async remove(id: number): Promise<void> {
    const recurso = await this.findOne(id);
    await this.recursosRepo.softRemove(recurso);
  }
}
