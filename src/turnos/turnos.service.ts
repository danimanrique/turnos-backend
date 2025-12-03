import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './entities/turno.entity';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Recurso } from '../recursos/entities/recurso.entity';
import { Disponibilidad } from '../disponibilidades/entities/disponibilidad.entity';
import { FilterTurnoDto } from './dto/filter-turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnosRepo: Repository<Turno>,
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
    @InjectRepository(Recurso)
    private readonly recursosRepo: Repository<Recurso>,
    @InjectRepository(Disponibilidad)
    private readonly disponibilidadesRepo: Repository<Disponibilidad>,
  ) {}

  async create(dto: CreateTurnoDto): Promise<Turno> {
    const usuario = await this.resolveUsuario(dto);
    const recurso = await this.recursosRepo.findOne({
      where: { id: dto.recursoId },
    });
    if (!recurso) {
      throw new NotFoundException('Recurso no encontrado');
    }

    const fechaInicio = new Date(dto.fechaHoraInicio);
    const fechaFin = new Date(dto.fechaHoraFin);
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      throw new BadRequestException('Fechas inválidas');
    }
    if (fechaFin <= fechaInicio) {
      throw new BadRequestException(
        'fechaHoraFin debe ser mayor a fechaHoraInicio',
      );
    }

    const disponibilidad = await this.encontrarDisponibilidadValida(
      recurso.id,
      fechaInicio,
      fechaFin,
      dto.disponibilidadId,
    );
    await this.validarSuperposicion(recurso.id, fechaInicio, fechaFin);

    const turno = this.turnosRepo.create({
      usuario,
      recurso,
      disponibilidad,
      fechaHoraInicio: fechaInicio,
      fechaHoraFin: fechaFin,
      estado: 'RESERVADO',
      motivo: dto.motivo,
      canalReserva: dto.canalReserva ?? 'PUBLICO',
    });
    return this.turnosRepo.save(turno);
  }

  async findAll(filtros: FilterTurnoDto): Promise<Turno[]> {
    const qb = this.turnosRepo
      .createQueryBuilder('turno')
      .leftJoinAndSelect('turno.usuario', 'usuario')
      .leftJoinAndSelect('turno.recurso', 'recurso')
      .leftJoinAndSelect('turno.disponibilidad', 'disponibilidad')
      .where('turno.deletedAt IS NULL');

    if (filtros.recursoId) {
      qb.andWhere('turno.recursoId = :recursoId', {
        recursoId: filtros.recursoId,
      });
    }
    if (filtros.usuarioId) {
      qb.andWhere('turno.usuarioId = :usuarioId', {
        usuarioId: filtros.usuarioId,
      });
    }
    if (filtros.desde) {
      qb.andWhere('turno.fechaHoraInicio >= :desde', { desde: filtros.desde });
    }
    if (filtros.hasta) {
      qb.andWhere('turno.fechaHoraFin <= :hasta', { hasta: filtros.hasta });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Turno> {
    const turno = await this.turnosRepo.findOne({
      where: { id },
      relations: ['usuario', 'recurso', 'disponibilidad'],
    });
    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }
    return turno;
  }

  async update(id: number, dto: UpdateTurnoDto): Promise<Turno> {
    const turno = await this.findOne(id);
    if (dto.usuarioId) {
      const usuario = await this.usuariosRepo.findOne({
        where: { id: dto.usuarioId },
      });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }
      turno.usuario = usuario;
    }
    if (dto.recursoId) {
      const recurso = await this.recursosRepo.findOne({
        where: { id: dto.recursoId },
      });
      if (!recurso) {
        throw new NotFoundException('Recurso no encontrado');
      }
      turno.recurso = recurso;
    }
    if (dto.disponibilidadId) {
      const disponibilidad = await this.disponibilidadesRepo.findOne({
        where: { id: dto.disponibilidadId },
      });
      if (!disponibilidad) {
        throw new NotFoundException('Disponibilidad no encontrada');
      }
      turno.disponibilidad = disponibilidad;
    }
    if (dto.fechaHoraInicio) {
      turno.fechaHoraInicio = new Date(dto.fechaHoraInicio);
    }
    if (dto.fechaHoraFin) {
      turno.fechaHoraFin = new Date(dto.fechaHoraFin);
    }
    if (turno.fechaHoraFin <= turno.fechaHoraInicio) {
      throw new BadRequestException(
        'fechaHoraFin debe ser mayor a fechaHoraInicio',
      );
    }
    if (dto.estado) {
      turno.estado = dto.estado;
    }
    if (dto.motivo !== undefined) {
      turno.motivo = dto.motivo;
    }
    if (dto.canalReserva !== undefined) {
      turno.canalReserva = dto.canalReserva;
    }
    await this.validarSuperposicion(
      turno.recurso.id,
      turno.fechaHoraInicio,
      turno.fechaHoraFin,
    );
    turno.disponibilidad = await this.encontrarDisponibilidadValida(
      turno.recurso.id,
      turno.fechaHoraInicio,
      turno.fechaHoraFin,
      turno.disponibilidad?.id,
    );

    return this.turnosRepo.save(turno);
  }

  async remove(id: number): Promise<void> {
    const turno = await this.findOne(id);
    await this.turnosRepo.softRemove(turno);
  }

  async obtenerSlotsDisponibles(
    recursoId: number,
    fecha: string,
  ): Promise<
    { inicio: string; fin: string; disponibilidadId: number; capacidad: number }[]
  > {
    const targetDate = new Date(`${fecha}T00:00:00`);
    if (isNaN(targetDate.getTime())) {
      throw new BadRequestException('Fecha inválida, formato esperado YYYY-MM-DD');
    }
    const dayOfWeek = targetDate.getDay();
    const dateOnly = targetDate.toISOString().slice(0, 10);

    const disponibilidades = await this.disponibilidadesRepo
      .createQueryBuilder('d')
      .leftJoin('d.recurso', 'recurso')
      .where('recurso.id = :recursoId', { recursoId })
      .andWhere('d.estado = :estado', { estado: 'ACTIVA' })
      .andWhere('d.fechaDesde <= :dateOnly', { dateOnly })
      .andWhere('(d.fechaHasta IS NULL OR d.fechaHasta >= :dateOnly)', {
        dateOnly,
      })
      .getMany();

    const startOfDay = new Date(`${dateOnly}T00:00:00`);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const turnosExistentes = await this.turnosRepo
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

    const slots = [];

    for (const disp of disponibilidades) {
      if (!this.diaDisponible(disp.diasSemana, dayOfWeek)) {
        continue;
      }
      const duracion = disp.duracionSlotMin;
      const inicioMin = this.parseTimeToMinutes(disp.horaInicio);
      const finMin = this.parseTimeToMinutes(disp.horaFin);

      for (
        let slotInicioMin = inicioMin;
        slotInicioMin + duracion <= finMin;
        slotInicioMin += duracion
      ) {
        const slotInicio = new Date(startOfDay);
        slotInicio.setMinutes(slotInicio.getMinutes() + slotInicioMin);
        const slotFin = new Date(startOfDay);
        slotFin.setMinutes(slotFin.getMinutes() + slotInicioMin + duracion);

        const ocupados = turnosExistentes.filter((turno) =>
          this.intervaloSeSuperpone(
            slotInicio,
            slotFin,
            new Date(turno.fechaHoraInicio),
            new Date(turno.fechaHoraFin),
          ),
        ).length;

        if (ocupados < disp.capacidadPorSlot) {
          slots.push({
            inicio: slotInicio.toISOString(),
            fin: slotFin.toISOString(),
            disponibilidadId: disp.id,
            capacidad: disp.capacidadPorSlot - ocupados,
          });
        }
      }
    }

    return slots;
  }

  private async encontrarDisponibilidadValida(
    recursoId: number,
    fechaInicio: Date,
    fechaFin: Date,
    disponibilidadId?: number,
  ): Promise<Disponibilidad> {
    const dateOnly = fechaInicio.toISOString().slice(0, 10);
    const qb = this.disponibilidadesRepo
      .createQueryBuilder('d')
      .leftJoin('d.recurso', 'recurso')
      .where('recurso.id = :recursoId', { recursoId })
      .andWhere('d.estado = :estado', { estado: 'ACTIVA' })
      .andWhere('d.deletedAt IS NULL')
      .andWhere('d.fechaDesde <= :dateOnly', { dateOnly })
      .andWhere('(d.fechaHasta IS NULL OR d.fechaHasta >= :dateOnly)', {
        dateOnly,
      });
    if (disponibilidadId) {
      qb.andWhere('d.id = :disponibilidadId', { disponibilidadId });
    }
    const disponibilidades = await qb.getMany();

    const diaSemana = fechaInicio.getDay();
    const duracionMin = this.diferenciaEnMinutos(fechaInicio, fechaFin);

    for (const disp of disponibilidades) {
      if (!this.diaDisponible(disp.diasSemana, diaSemana)) {
        continue;
      }
      const inicioMin = this.minutosDelDia(fechaInicio);
      const finMin = this.minutosDelDia(fechaFin);
      const dispInicio = this.parseTimeToMinutes(disp.horaInicio);
      const dispFin = this.parseTimeToMinutes(disp.horaFin);

      if (
        inicioMin >= dispInicio &&
        finMin <= dispFin &&
        duracionMin % disp.duracionSlotMin === 0
      ) {
        return disp;
      }
    }

    throw new BadRequestException(
      'El turno no cae dentro de una disponibilidad activa del recurso',
    );
  }

  private async validarSuperposicion(
    recursoId: number,
    fechaInicio: Date,
    fechaFin: Date,
  ) {
    const count = await this.turnosRepo
      .createQueryBuilder('turno')
      .where('turno.recursoId = :recursoId', { recursoId })
      .andWhere('turno.deletedAt IS NULL')
      .andWhere('turno.estado IN (:...estados)', {
        estados: ['RESERVADO', 'CONFIRMADO'],
      })
      .andWhere(
        '(turno.fechaHoraInicio < :fin AND turno.fechaHoraFin > :inicio)',
        { inicio: fechaInicio, fin: fechaFin },
      )
      .getCount();

    if (count > 0) {
      throw new BadRequestException(
        'El turno se superpone con otro turno activo del mismo recurso',
      );
    }
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

  private minutosDelDia(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  }

  private diferenciaEnMinutos(inicio: Date, fin: Date): number {
    return Math.floor((fin.getTime() - inicio.getTime()) / 60000);
  }

  private intervaloSeSuperpone(
    inicioA: Date,
    finA: Date,
    inicioB: Date,
    finB: Date,
  ): boolean {
    return inicioA < finB && finA > inicioB;
  }

  private async resolveUsuario(dto: CreateTurnoDto): Promise<Usuario> {
    if (dto.usuarioId) {
      const usuario = await this.usuariosRepo.findOne({
        where: { id: dto.usuarioId },
      });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');
      return usuario;
    }

    if (dto.usuarioEmail && dto.usuarioNombre && dto.usuarioApellido) {
      const existing = await this.usuariosRepo.findOne({
        where: { email: dto.usuarioEmail },
      });
      if (existing) return existing;
      const nuevo = this.usuariosRepo.create({
        nombre: dto.usuarioNombre,
        apellido: dto.usuarioApellido,
        email: dto.usuarioEmail,
        passwordHash: '',
        activo: true,
      });
      return this.usuariosRepo.save(nuevo);
    }

    throw new BadRequestException(
      'Se requiere usuarioId o datos de usuario (nombre, apellido, email) para crear el turno',
    );
  }
}
