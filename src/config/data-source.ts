import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
import { registerAs } from "@nestjs/config";


dotenv.config({
    path: '.env.development',
});


const SqliteTestDataSourceOptions: DataSourceOptions = {
    type: 'sqlite',
    database: ':memory:',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    dropSchema: true,
};

const PostgresDataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    dropSchema: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migration/*{.ts,.js}'],
    subscribers: [],
    // ssl: true,
}


export const postgresDataSourceConfig = registerAs(
    'postgres',
    () => PostgresDataSourceOptions,
);

export const sqliteDataSourceConfig = registerAs(
    'sqlite',
    () => SqliteTestDataSourceOptions,
);


export const PostgresDataSource = new DataSource(PostgresDataSourceOptions);
export const SqliteDataSource = new DataSource(SqliteTestDataSourceOptions);