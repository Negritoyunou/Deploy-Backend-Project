import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { UserModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresDataSourceConfig, sqliteDataSourceConfig } from './config/data-source';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderDetailsModule } from './modules/orderdetails/orderDetails.module';
import { SeedModule } from './seeds/seeds.module';
import { SharedModule } from './shared/shared/shared.module';
import { AppController } from './app.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', 'env'],
      isGlobal: true,
      load: [postgresDataSourceConfig, sqliteDataSourceConfig, () => ({
        environment: process.env.ENVIRONMENT || 'TEST',
      })],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => (
        configService.get('environment') === 'TEST' 
        ? configService.get('sqlite') 
        : configService.get('postgres')
      ),
    }),
    UserModule,
    AuthModule, 
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    OrderDetailsModule,
    SeedModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
