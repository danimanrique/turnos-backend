import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'environment/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { username, host, database, password, port, logging } =
          configService.database;
        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          logging,
          synchronize: false, // NUNCA CAMBIAR!!!!
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          charset: 'utf8mb4',
          collation: 'utf8mb4_general_ci',
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  constructor() {
    console.log('DatabaseModule initialized');
  }
}
