import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { SharedModule } from 'src/shared/shared/shared.module';
import { UserService } from '../users/users.service';


@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})

export class AuthModule {}