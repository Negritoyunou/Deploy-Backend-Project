import { Body, Injectable, Param } from '@nestjs/common';
import { CreateUserdto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { UpdateUserdto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>  
    ) {}

    async findAll(){
      return await this.usersRepository.find()
    }

    async getUsers(page: number, limit: number) {
      const skip = (page - 1) * limit
        return await this.usersRepository.find({
          take: limit,
          skip: skip,
        });
    }

    async getUserById(userId: string): Promise<Partial<User>> {
      return await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['orders'],
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          country: true,
          address: true,
          city: true,
          orders: {
            id: true,
            date: true, 
          },
        },
      });
    }
    async createUser(user: CreateUserdto): Promise<User> {
      const newUser = this.usersRepository.create(user);
        return await this.usersRepository.save(newUser);
    }

    async updateUserById(id: string, user: UpdateUserdto): Promise<User> {
        const userFind = await this.usersRepository.findOneBy({ id })
        if(!userFind){
          throw new Error('User not found')
        }
          await this.usersRepository.update(id, user);
          return await this.usersRepository.findOneBy({ id })
      }


      
      async deleteUser(id: string): Promise<{id: string}> {
        await this.usersRepository.delete(id);
        return { id };
      }

      async findByEmail(email: string){
        return this.usersRepository.findOne({ where: { email: email }});
      }
}