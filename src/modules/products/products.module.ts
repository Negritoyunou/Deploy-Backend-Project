import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { CloudinaryService } from '../service/cloudinary/cloudinary.service';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Products]), FileUploadModule],
  controllers: [ProductsController],
  providers: [ProductsService, FileUploadService, CloudinaryService],
  exports: [ProductsService],
})

export class ProductsModule {}