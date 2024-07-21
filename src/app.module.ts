import { ClassSerializerInterceptor, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { DatabaseModule } from "./database.module"
import { AuthModule } from "./modules/auth/auth.module"
import { UserModule } from "./modules/user/user.module"
import { ValidatorModule } from "./packages/validator/validator.module"
import { SessionModule } from "./modules/session/session.module"

@Module({
  imports: [
    ValidatorModule,
    ConfigModule,
    DatabaseModule,
    AuthModule,
    SessionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
