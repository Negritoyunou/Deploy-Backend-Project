import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./categories.entity";
import { Repository } from "typeorm";
import { CreateCategoriesdto } from "./dto/create-categories.dto";
import { UpdateCategoryDto } from "./dto/update-categories.dto";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>
    ) {}

    async findAll(): Promise<Category[]> {
        return await this.categoriesRepository.find();
      }

    async create(createCategoriesdto: CreateCategoriesdto){
        return await this.categoriesRepository.save(createCategoriesdto)
    }

    async updateCategoryById(id: string, updateCategoryById: UpdateCategoryDto){
        const categoryFinded = await this.categoriesRepository.findOneBy({ id })
        if(!categoryFinded){
          throw new Error('Product not found')
        }
        await this.categoriesRepository.update(id, updateCategoryById)
        return await this.categoriesRepository.findOneBy({ id })
      }

    async deleteCategoryById(id: string): Promise<{id: string}>{
        await this.categoriesRepository.delete(id)
        return { id };
    }
}