import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Recurso } from './entities/recurso.entity';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { UpdateRecursoDto } from './dto/update-recurso.dto';
import { Disponibilidad } from '../disponibilidades/entities/disponibilidad.entity';
import { Turno } from '../turnos/entities/turno.entity';
import { Sucursal } from '../sucursales/entities/sucursal.entity';
import { TipoRecurso } from '../tipos-recurso/entities/tipo-recurso.entity';

@Injectable()
export class RecursosService {
  constructor(
    @InjectRepository(Recurso)
    private readonly recursosRepo: Repository<Recurso>,
    @InjectRepository(Disponibilidad)
    private readonly disponibilidadesRepo: Repository<Disponibilidad>,
    @InjectRepository(Turno)
    private readonly turnosRepo: Repository<Turno>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepo: Repository<Sucursal>,
    @InjectRepository(TipoRecurso)
    private readonly tipoRepo: Repository<TipoRecurso>,
  ) {}

  async create(dto: CreateRecursoDto): Promise<Recurso> {
    await this.ensureSucursalActiva(dto.sucursalId);
    await this.ensureTipoRecursoActivo(dto.tipoRecursoId);
    const recurso = this.recursosRepo.create(dto);
    return this.recursosRepo.save(recurso);
  }

  findAll(filters?: { sucursalId?: number; tipoRecursoId?: number }): Promise<Recurso[]> {
    const where: any = { deletedAt: IsNull() };
    if (filters?.sucursalId) where.sucursalId = filters.sucursalId;
    if (filters?.tipoRecursoId) where.tipoRecursoId = filters.tipoRecursoId;
    return this.recursosRepo.find({
      where,
      relations: ['sucursal', 'tipoRecurso'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Recurso> {
    const recurso = await this.recursosRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['sucursal', 'tipoRecurso'],
    });
    if (!recurso) {
      throw new NotFoundException('Recurso no encontrado');
    }
    return recurso;
  }

  async update(id: number, dto: UpdateRecursoDto): Promise<Recurso> {
    const recurso = await this.findOne(id);
    if (dto.sucursalId) {
      await this.ensureSucursalActiva(dto.sucursalId);
    }
    if (dto.tipoRecursoId) {
      await this.ensureTipoRecursoActivo(dto.tipoRecursoId);
    }
    Object.assign(recurso, dto);
    return this.recursosRepo.save(recurso);
  }

  async remove(id: number): Promise<void> {
    const recurso = await this.findOne(id);
    await this.recursosRepo.softRemove(recurso);
  }

  async obtenerSlotsDisponibles(
    recursoId: number,
    fecha: string,
  ): Promise<
    { inicio: string; fin: string; disponibilidadId: number; capacidadLibre: number }[]
  > {
    const recurso = await this.recursosRepo.findOne({
      where: { id: recursoId, deletedAt: IsNull() },
    });
    if (!recurso) {
      throw new NotFoundException('Recurso no encontrado');
    }

    const targetDate = new Date(`${fecha}T00:00:00`);
    if (isNaN(targetDate.getTime())) {
      throw new BadRequestException('Fecha inválida, se espera YYYY-MM-DD');
    }
    const dayOfWeek = targetDate.getDay();
    const dateOnly = targetDate.toISOString().slice(0, 10);
    const startOfDay = new Date(`${dateOnly}T00:00:00`);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const disponibilidades = await this.disponibilidadesRepo
      .createQueryBuilder('d')
      .where('d.estado = :estado', { estado: 'ACTIVA' })
      .andWhere('d.deletedAt IS NULL')
      .andWhere('d.recursoId = :recursoId', { recursoId })
      .andWhere('d.fechaDesde <= :dateOnly', { dateOnly })
      .andWhere('(d.fechaHasta IS NULL OR d.fechaHasta >= :dateOnly)', {
        dateOnly,
      })
      .getMany();

    const slots: {
      disponibilidadId: number;
      inicio: Date;
      fin: Date;
      capacidadLibre: number;
    }[] = [];

    for (const disp of disponibilidades) {
      if (!this.diaDisponible(disp.diasSemana, dayOfWeek)) {
        continue;
      }
      const inicioRangoMin = this.parseTimeToMinutes(disp.horaInicio);
      const finRangoMin = this.parseTimeToMinutes(disp.horaFin);
      const duracion = disp.duracionSlotMin;

      for (
        let slotInicioMin = inicioRangoMin;
        slotInicioMin + duracion <= finRangoMin;
        slotInicioMin += duracion
      ) {
        const slotInicio = new Date(startOfDay);
        slotInicio.setMinutes(slotInicio.getMinutes() + slotInicioMin);
        const slotFin = new Date(startOfDay);
        slotFin.setMinutes(slotFin.getMinutes() + slotInicioMin + duracion);

        slots.push({
          disponibilidadId: disp.id,
          inicio: slotInicio,
          fin: slotFin,
          capacidadLibre: disp.capacidadPorSlot,
        });
      }
    }

    if (slots.length === 0) {
      return [];
    }

    const turnos = await this.turnosRepo
      .createQueryBuilder('t')
      .where('t.recursoId = :recursoId', { recursoId })
      .andWhere('t.deletedAt IS NULL')
      .andWhere('t.estado IN (:...estados)', {
        estados: ['RESERVADO', 'CONFIRMADO'],
      })
      .andWhere('t.fechaHoraInicio < :finDia AND t.fechaHoraFin > :inicioDia', {
        inicioDia: startOfDay,
        finDia: endOfDay,
      })
      .getMany();

    for (const turno of turnos) {
      const inicioTurno = new Date(turno.fechaHoraInicio);
      const finTurno = new Date(turno.fechaHoraFin);
      for (const slot of slots) {
        if (this.intervaloSeSuperpone(slot.inicio, slot.fin, inicioTurno, finTurno)) {
          slot.capacidadLibre = Math.max(0, slot.capacidadLibre - 1);
        }
      }
    }

    return slots
      .filter((s) => s.capacidadLibre > 0)
      .map((s) => ({
        disponibilidadId: s.disponibilidadId,
        inicio: s.inicio.toISOString(),
        fin: s.fin.toISOString(),
        capacidadLibre: s.capacidadLibre,
      }));
  }

  private diaDisponible(diasSemana: string, dia: number): boolean {
    return diasSemana
      .split(',')
      .map((d) => parseInt(d.trim(), 10))
      .includes(dia);
  }

  private parseTimeToMinutes(time: string): number {
    const [h, m, s] = time.split(':').map((v) => parseInt(v, 10));
    return h * 60 + (m || 0) + (s ? s / 60 : 0);
  }

  private intervaloSeSuperpone(
    inicioA: Date,
    finA: Date,
    inicioB: Date,
    finB: Date,
  ): boolean {
    return inicioA < finB && finA > inicioB;
  }

  private async ensureSucursalActiva(id: number) {
    const sucursal = await this.sucursalRepo.findOne({
      where: { id, deletedAt: IsNull(), activo: true },
    });
    if (!sucursal) {
      throw new BadRequestException('Sucursal no existe o está inactiva');
    }
    return sucursal;
  }

  private async ensureTipoRecursoActivo(id: number) {
    const tipo = await this.tipoRepo.findOne({
      where: { id, deletedAt: IsNull(), activo: true },
    });
    if (!tipo) {
      throw new BadRequestException('Tipo de recurso no existe o está inactivo');
    }
    return tipo;
  }
}
