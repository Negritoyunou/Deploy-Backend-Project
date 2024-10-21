import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { Repository } from 'typeorm';
import { CreateProductsdto } from './dto/create-product.dto';
import { UploadFileDto } from '../file-upload/dto/upload-file.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { UpdateProductsDto } from './dto/update-product.dto';




@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    private readonly fileUploadService: FileUploadService
  ) {}

    async getProducts(page: number, limit: number) {
      const skip = (page - 1) * limit
        return await this.productsRepository.find({
          take: limit,
          skip: skip,
        });
    }
    
    async getProductsById(id: string): Promise<Products> {
        return await this.productsRepository.findOneBy({ id });
    }

    async createProducts(product: CreateProductsdto): Promise<Products> {
        const newProduct = this.productsRepository.create(product)
        return await this.productsRepository.save(newProduct);
    }

    async updateProductById(id: string, updateProductById: UpdateProductsDto){
      const productFinded = await this.productsRepository.findOneBy({ id })
      if(!productFinded){
        throw new Error('Product not found')
      }
      await this.productsRepository.update(id, updateProductById)
      return await this.productsRepository.findOneBy({ id })
    }
      
    async deleteProducts(id: string): Promise<{ id: string }>{
      await this.productsRepository.delete(id);
      return { id };
    }

    async buyProducts(id: string){
      const product = await this.productsRepository.findOneBy({ id });

      if(!product){
        console.log('Producto no encontrado para el ID: ', id);
        throw new Error('Product not found')
      }

      // Verifica el stock del producto
      console.log('Stock del producto antes de la compra:', product.stock);

      if(product.stock === 0) {
        throw new Error('Out of stock');
      }

      // Verifica los valores antes de realizar el update
      console.log('Actualizando stock del producto ID:', id, 'Nuevo stock:', product.stock - 1);

      await this.productsRepository.update( id , {
        stock: product.stock - 1
      });

      console.log('Product bought successfully');
      return product.price;
    }

    async updateProduct(id: string, updateProductsDto: UpdateProductsDto){
      const producto = this.productsRepository.findOneBy({ id })

      if(!producto){
        return null
      }
      
      await this.productsRepository.update(id, updateProductsDto)

      return await this.productsRepository.findOneBy({ id })
    }

    async uploadFile(file: UploadFileDto, id: string){
      const url = await this.fileUploadService.uploadFile({
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      });
      await this.productsRepository.update(id, { imgUrl: url })
      return { imgUrl: url }
    }
}
