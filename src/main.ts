import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './middlewares/logger.middleware';
import 'reflect-metadata';
import { CategoriesSeed } from './seeds/categories/categories.seed';
import { ProductsSeed } from './seeds/products/products.seed';
import { SeedModule } from './seeds/seeds.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.use(LoggerGlobal)

  const swaggerConfig = new DocumentBuilder().setTitle('Nest PT21A').setDescription('App for cohort for M4 backend').addBearerAuth().setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document);

  const categoriesSeed = app.select(SeedModule).get(CategoriesSeed);
  await categoriesSeed.seed();

  console.log("La insercion de categorias ha terminado");
  
  const productSeed = app.select(SeedModule).get(ProductsSeed);
  await productSeed.seed();

  console.log("La insercion de productos ha terminado");

  await app.listen(3000);
  
}
bootstrap();
