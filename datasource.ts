import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

config();

export const databaseOptions: DataSourceOptions = {
  port: Number(process.env.DATABASE_PORT) || 3306,
  host: process.env.DATABASE_HOST,
  type: process.env.DATABASE_TYPE as "mysql",
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ["dist/src/modules/**/*.entity{.ts,.js}"],
  migrations: ["dist/src/database/migrations/*{.ts,.js}"],
  subscribers: ["dist/src/modules/**/*.subscriber{.ts,.js}"],
  synchronize: true,
  migrationsTableName: process.env.DATABASE_MIGRATION || "migrations",
};

const dataSource = new DataSource(databaseOptions);

export default dataSource;
