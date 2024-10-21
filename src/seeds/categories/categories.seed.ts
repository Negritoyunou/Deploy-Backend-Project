import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/modules/categories/categories.entity";
import { In, Repository } from "typeorm";
import { categories } from "./categories-mock";

@Injectable()
export class CategoriesSeed {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }


    async seed() {
        const existingCategories = await this.categoryRepository.find({
            where: { name: In(categories) },
        });


        for (const categoryName of categories) {
            if (
                !existingCategories.some((categories) => categories.name === categoryName)
            ) {
                const categories = new Category();
                categories.name = categoryName;
                await this.categoryRepository.save(categories);
            }
        }
    }
}