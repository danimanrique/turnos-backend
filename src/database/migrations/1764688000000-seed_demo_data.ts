import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDemoData1764688000000 implements MigrationInterface {
    name = 'SeedDemoData1764688000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Usuarios demo
        const userResult: any = await queryRunner.query(
            `INSERT INTO usuarios (nombre, apellido, email, passwordHash, activo) VALUES (?, ?, ?, ?, ?)`,
            ['Demo', 'Admin', 'demo@turnero.com', '$2b$10$prJR6Sf.G8kScv9mlvWsDeZDceXdg04uAMvz0fTXIzUPMwAYKBJRK', true],
        );
        const usuarioId = userResult.insertId;

        // Sucursales demo
        const sucursalCentro: any = await queryRunner.query(
            `INSERT INTO sucursales (nombre, direccion, descripcion, activo) VALUES (?, ?, ?, ?)`,
            ['Sucursal Centro', 'Av. Principal 123', 'Sucursal principal para pruebas', true],
        );
        const sucursalNorte: any = await queryRunner.query(
            `INSERT INTO sucursales (nombre, direccion, descripcion, activo) VALUES (?, ?, ?, ?)`,
            ['Sucursal Norte', 'Calle 9 de Julio 456', 'Sucursal secundaria', true],
        );
        const sucursalCentroId = sucursalCentro.insertId;
        const sucursalNorteId = sucursalNorte.insertId;

        // Tipos de recurso demo
        const tipoProfesional: any = await queryRunner.query(
            `INSERT INTO tipos_recurso (nombre, codigo, descripcion, activo) VALUES (?, ?, ?, ?)`,
            ['Profesional', 'PROFESIONAL', 'Profesionales de agenda', true],
        );
        const tipoCancha: any = await queryRunner.query(
            `INSERT INTO tipos_recurso (nombre, codigo, descripcion, activo) VALUES (?, ?, ?, ?)`,
            ['Cancha', 'CANCHA', 'Espacios deportivos', true],
        );
        const tipoProfesionalId = tipoProfesional.insertId;
        const tipoCanchaId = tipoCancha.insertId;

        // Recursos demo
        const recursoMedico: any = await queryRunner.query(
            `INSERT INTO recursos (nombre, descripcion, activo, sucursalId, tipoRecursoId) VALUES (?, ?, ?, ?, ?)`,
            ['Dra. García', 'Clínica general', true, sucursalCentroId, tipoProfesionalId],
        );
        const recursoCancha: any = await queryRunner.query(
            `INSERT INTO recursos (nombre, descripcion, activo, sucursalId, tipoRecursoId) VALUES (?, ?, ?, ?, ?)`,
            ['Cancha 1', 'Fútbol 5 con césped sintético', true, sucursalNorteId, tipoCanchaId],
        );
        const recursoMedicoId = recursoMedico.insertId;
        const recursoCanchaId = recursoCancha.insertId;

        // Disponibilidades demo
        const dispMedico: any = await queryRunner.query(
            `INSERT INTO disponibilidades (fechaDesde, fechaHasta, diasSemana, horaInicio, horaFin, duracionSlotMin, capacidadPorSlot, estado, recursoId)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['2025-01-01', null, '1,2,3,4,5', '09:00:00', '13:00:00', 30, 1, 'ACTIVA', recursoMedicoId],
        );
        const dispCancha: any = await queryRunner.query(
            `INSERT INTO disponibilidades (fechaDesde, fechaHasta, diasSemana, horaInicio, horaFin, duracionSlotMin, capacidadPorSlot, estado, recursoId)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['2025-01-01', null, '1,2,3,4,5,6', '16:00:00', '22:00:00', 60, 4, 'ACTIVA', recursoCanchaId],
        );
        const disponibilidadMedicoId = dispMedico.insertId;
        const disponibilidadCanchaId = dispCancha.insertId;

        // Turnos de ejemplo (uno por disponibilidad)
        await queryRunner.query(
            `INSERT INTO turnos (fechaHoraInicio, fechaHoraFin, estado, motivo, canalReserva, usuarioId, recursoId, disponibilidadId)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['2025-01-02 09:00:00', '2025-01-02 09:30:00', 'CONFIRMADO', 'Consulta de control', 'WEB', usuarioId, recursoMedicoId, disponibilidadMedicoId],
        );
        await queryRunner.query(
            `INSERT INTO turnos (fechaHoraInicio, fechaHoraFin, estado, motivo, canalReserva, usuarioId, recursoId, disponibilidadId)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['2025-01-03 18:00:00', '2025-01-03 19:00:00', 'RESERVADO', 'Partido amistoso', 'WEB', usuarioId, recursoCanchaId, disponibilidadCanchaId],
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar turnos demo
        await queryRunner.query(
            `DELETE FROM turnos WHERE motivo IN ('Consulta de control', 'Partido amistoso')`,
        );
        // Eliminar disponibilidades demo
        await queryRunner.query(
            `DELETE FROM disponibilidades WHERE horaInicio IN ('09:00:00', '16:00:00') AND duracionSlotMin IN (30,60)`,
        );
        // Eliminar recursos demo
        await queryRunner.query(
            `DELETE FROM recursos WHERE nombre IN ('Dra. García', 'Cancha 1')`,
        );
        // Eliminar tipos de recurso demo
        await queryRunner.query(
            `DELETE FROM tipos_recurso WHERE codigo IN ('PROFESIONAL', 'CANCHA')`,
        );
        // Eliminar sucursales demo
        await queryRunner.query(
            `DELETE FROM sucursales WHERE nombre IN ('Sucursal Centro', 'Sucursal Norte')`,
        );
        // Eliminar usuario demo
        await queryRunner.query(
            `DELETE FROM usuarios WHERE email = 'demo@turnero.com'`,
        );
    }
}
