import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { SessionEntity } from "./entities/session.entity"
import { UserEntity } from "./entities/user.entity"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"
import { SessionService } from "./session.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([SessionEntity]),
  ],
  controllers: [UserController],
  providers: [UserService, SessionService],
  exports: [UserService, SessionService],
})
export class UserModule {}
