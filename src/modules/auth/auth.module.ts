import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import { config } from "dotenv"
import { UserEntity } from "../user/entities/user.entity"
import { UserModule } from "../user/user.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { SessionModule } from "../session/session.module"

config({})

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    SessionModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [],
      imports: [],
      useFactory() {
        return {
          global: true,
          secret: process.env.JWT_SECRET as string,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm: (process.env.JWT_ALGORITHM || "HS256") as "HS256",
          },
        }
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
