import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1764687172510 implements MigrationInterface {
    name = 'InitDb1764687172510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`apellido\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`passwordHash\` varchar(255) NOT NULL, \`activo\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_446adfc18b35418aac32ae0b7b\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`disponibilidades\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fechaDesde\` date NOT NULL, \`fechaHasta\` date NULL, \`diasSemana\` varchar(255) NOT NULL, \`horaInicio\` time NOT NULL, \`horaFin\` time NOT NULL, \`duracionSlotMin\` int NOT NULL, \`capacidadPorSlot\` int NOT NULL DEFAULT '1', \`estado\` varchar(255) NOT NULL DEFAULT 'ACTIVA', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`recursoId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sucursales\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`direccion\` varchar(255) NULL, \`descripcion\` varchar(255) NULL, \`slogan\` varchar(255) NULL, \`logo\` varchar(255) NULL, \`activo\` tinyint NOT NULL DEFAULT 1, \`usuarioId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tipos_recurso\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`codigo\` varchar(255) NOT NULL, \`descripcion\` varchar(255) NULL, \`activo\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_46361dc09fe689b55271819d3f\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recursos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`descripcion\` varchar(255) NULL, \`activo\` tinyint NOT NULL DEFAULT 1, \`sucursalId\` int NOT NULL, \`tipoRecursoId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`turnos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fechaHoraInicio\` datetime NOT NULL, \`fechaHoraFin\` datetime NOT NULL, \`estado\` varchar(255) NOT NULL DEFAULT 'RESERVADO', \`motivo\` varchar(255) NULL, \`canalReserva\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`usuarioId\` int NULL, \`recursoId\` int NULL, \`disponibilidadId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`disponibilidades\` ADD CONSTRAINT \`FK_0fce6ef7be84b326c1876e4dd13\` FOREIGN KEY (\`recursoId\`) REFERENCES \`recursos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`recursos\` ADD CONSTRAINT \`FK_fef51ac48370865d6f8d2321586\` FOREIGN KEY (\`sucursalId\`) REFERENCES \`sucursales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`recursos\` ADD CONSTRAINT \`FK_1741b5c72e9007f850169e59fe3\` FOREIGN KEY (\`tipoRecursoId\`) REFERENCES \`tipos_recurso\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`turnos\` ADD CONSTRAINT \`FK_1027e9a08b130102f397b7d4941\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`turnos\` ADD CONSTRAINT \`FK_b4429020969f3a18ea97ce48b99\` FOREIGN KEY (\`recursoId\`) REFERENCES \`recursos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`turnos\` ADD CONSTRAINT \`FK_74279708f165a39e5555b633a8e\` FOREIGN KEY (\`disponibilidadId\`) REFERENCES \`disponibilidades\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sucursales\` ADD CONSTRAINT \`FK_sucursales_usuario\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sucursales\` DROP FOREIGN KEY \`FK_sucursales_usuario\``);
        await queryRunner.query(`ALTER TABLE \`turnos\` DROP FOREIGN KEY \`FK_74279708f165a39e5555b633a8e\``);
        await queryRunner.query(`ALTER TABLE \`turnos\` DROP FOREIGN KEY \`FK_b4429020969f3a18ea97ce48b99\``);
        await queryRunner.query(`ALTER TABLE \`turnos\` DROP FOREIGN KEY \`FK_1027e9a08b130102f397b7d4941\``);
        await queryRunner.query(`ALTER TABLE \`recursos\` DROP FOREIGN KEY \`FK_1741b5c72e9007f850169e59fe3\``);
        await queryRunner.query(`ALTER TABLE \`recursos\` DROP FOREIGN KEY \`FK_fef51ac48370865d6f8d2321586\``);
        await queryRunner.query(`ALTER TABLE \`disponibilidades\` DROP FOREIGN KEY \`FK_0fce6ef7be84b326c1876e4dd13\``);
        await queryRunner.query(`DROP TABLE \`turnos\``);
        await queryRunner.query(`DROP TABLE \`recursos\``);
        await queryRunner.query(`DROP INDEX \`IDX_46361dc09fe689b55271819d3f\` ON \`tipos_recurso\``);
        await queryRunner.query(`DROP TABLE \`tipos_recurso\``);
        await queryRunner.query(`DROP TABLE \`sucursales\``);
        await queryRunner.query(`DROP TABLE \`disponibilidades\``);
        await queryRunner.query(`DROP INDEX \`IDX_446adfc18b35418aac32ae0b7b\` ON \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
    }

}
