import { ClassSerializerInterceptor, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { DatabaseModule } from "./database.module"
import { AuthModule } from "./modules/auth/auth.module"
import { FeatureFlagModule } from "./modules/feature-flag/feature-flag.module"
import { FeatureFlagService } from "./modules/feature-flag/feature-flag.service"
import { SessionModule } from "./modules/session/session.module"
import { UserModule } from "./modules/user/user.module"
import { ValidatorModule } from "./packages/validator/validator.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        ".env",
        ".env.local",
        ".env.test",
        ".env.development",
        ".env.production",
      ],
      isGlobal: true,
    }),
    FeatureFlagModule,
    ValidatorModule,
    DatabaseModule,
    AuthModule,
    SessionModule,
    UserModule,
    FeatureFlagModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    FeatureFlagService,
  ],
})
export class AppModule {}
