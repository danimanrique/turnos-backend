import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { TipoRecurso } from './entities/tipo-recurso.entity';
import { CreateTipoRecursoDto } from './dto/create-tipo-recurso.dto';
import { Recurso } from '../recursos/entities/recurso.entity';

@Injectable()
export class TiposRecursoService {
  constructor(
    @InjectRepository(TipoRecurso)
    private readonly tipoRepo: Repository<TipoRecurso>,
    @InjectRepository(Recurso)
    private readonly recursoRepo: Repository<Recurso>,
  ) {}

  create(dto: CreateTipoRecursoDto) {
    const tipo = this.tipoRepo.create(dto);
    return this.tipoRepo.save(tipo);
  }

  findAll() {
    return this.tipoRepo.find({ where: { deletedAt: IsNull(), activo: true } });
  }

  async findOne(id: number) {
    const tipo = await this.tipoRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!tipo) throw new NotFoundException('Tipo de recurso no encontrado');
    return tipo;
  }

  async remove(id: number) {
    const tipo = await this.tipoRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!tipo) throw new NotFoundException('Tipo de recurso no encontrado');

    const recursosActivos = await this.recursoRepo.count({
      where: { tipoRecurso: { id }, deletedAt: IsNull() },
    });
    if (recursosActivos > 0) {
      throw new BadRequestException(
        'No se puede eliminar: existen recursos activos de este tipo.',
      );
    }

    await this.tipoRepo.softRemove(tipo);
    return { success: true };
  }
}
