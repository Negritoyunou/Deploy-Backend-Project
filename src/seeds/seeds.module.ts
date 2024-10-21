import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/modules/categories/categories.entity";
import { Products } from "src/modules/products/products.entity";
import { CategoriesSeed } from "./categories/categories.seed";
import { ProductsSeed } from "./products/products.seed";

@Module({
    imports: [TypeOrmModule.forFeature([Category, Products])],
    providers: [CategoriesSeed, ProductsSeed],
    exports: [CategoriesSeed, ProductsSeed],
})

export class SeedModule  {}