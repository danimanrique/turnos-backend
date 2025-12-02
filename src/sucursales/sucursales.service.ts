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
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursal)
    private readonly sucursalRepo: Repository<Sucursal>,
    @InjectRepository(Recurso)
    private readonly recursoRepo: Repository<Recurso>,
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  create(dto: CreateSucursalDto) {
    return this.ensureUsuario(dto.usuarioId).then(() => {
      const sucursal = this.sucursalRepo.create(dto);
      return this.sucursalRepo.save(sucursal);
    });
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

  private async ensureUsuario(id: number) {
    const user = await this.usuariosRepo.findOne({ where: { id, deletedAt: IsNull(), activo: true } });
    if (!user) {
      throw new BadRequestException('Usuario no existe o está inactivo');
    }
    return user;
  }
}
