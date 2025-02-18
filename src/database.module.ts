/* eslint-disable eqeqeq */
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DataSourceOptions } from "typeorm"

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService) {
        const databaseUrl = configService.get<string>("DATABASE_URL")

        if (!databaseUrl) {
          return {
            url: databaseUrl,
          }
        }

        return {
          url: configService.get<string>("DATABASE_URL"),
          type: configService.get<DataSourceOptions["type"]>(
            "DATABASE_TYPE",
          ) as "postgres",
          host: configService.get<string>("DATABASE_HOST"),
          port: parseInt(configService.get<string>("DATABASE_PORT"), 10),
          username: configService.get<string>("DATABASE_USER"),
          password: configService.get<string>("DATABASE_PASSWORD"),
          database: configService.get<string>("DATABASE_NAME"),
          entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          synchronize: configService.get<string>("DATABASE_SYNC") == "true",
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [],
  providers: [],
})
export class DatabaseModule {}
