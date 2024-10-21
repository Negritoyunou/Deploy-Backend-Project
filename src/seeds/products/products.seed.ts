import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Products } from "src/modules/products/products.entity";
import { Repository } from "typeorm";
import { productsMock } from "./products-mock";
import { Category } from "src/modules/categories/categories.entity";

@Injectable()
export class ProductsSeed {
    constructor(
        @InjectRepository(Products)
        private readonly productRepository: Repository<Products>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async findCategoryByName(category: string){
        const foundCategory = await this.categoryRepository.findOne({
            where: { name: category },
        });
        if(!foundCategory){
            throw new Error(`Category ${category} not found`)
        }
        return foundCategory;
    }

    async seed(){
        const existingProductsName = (await this.productRepository.find()).map(
            (product) => product.name,
        );

        for(const productData of productsMock){
            if(!existingProductsName.includes(productData.name)){
                const product = new Products();
                product.name = productData.name;
                product.description = productData.description;
                product.price = productData.price;
                product.stock = productData.stock;
                product.category = await this.findCategoryByName(productData.category);
                await this.productRepository.save(product);
            }
        }
    }
}