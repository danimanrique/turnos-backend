import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { Sucursal } from './entities/sucursal.entity';
import { Recurso } from '../recursos/entities/recurso.entity';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursal)
    private readonly sucursalRepo: Repository<Sucursal>,
    @InjectRepository(Recurso)
    private readonly recursoRepo: Repository<Recurso>,
  ) {}

  create(dto: CreateSucursalDto) {
    const sucursal = this.sucursalRepo.create(dto);
    return this.sucursalRepo.save(sucursal);
  }

  findAll() {
    return this.sucursalRepo.find({ where: { deletedAt: IsNull(), activo: true } });
  }

  async findOne(id: number) {
    const sucursal = await this.sucursalRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!sucursal) throw new NotFoundException('Sucursal no encontrada');
    return sucursal;
  }

  async remove(id: number) {
    const sucursal = await this.sucursalRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!sucursal) throw new NotFoundException('Sucursal no encontrada');

    const recursosActivos = await this.recursoRepo.count({
      where: { sucursal: { id }, deletedAt: IsNull() },
    });
    if (recursosActivos > 0) {
      throw new BadRequestException(
        'No se puede eliminar: la sucursal tiene recursos activos.',
      );
    }

    await this.sucursalRepo.softRemove(sucursal);
    return { success: true };
  }
}
