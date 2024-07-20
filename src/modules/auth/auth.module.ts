import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

@Module({
  imports: [],
  controllers: [AuthController],
  exports: [],
  providers: [],
})
export class AuthModule {}
