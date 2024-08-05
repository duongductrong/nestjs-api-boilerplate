import { ClassSerializerInterceptor, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { ScheduleModule } from "@nestjs/schedule"
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from "nestjs-i18n"
import { join } from "path"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { DatabaseModule } from "./database.module"
import { AuthModule } from "./modules/auth/auth.module"
import { FeatureFlagModule } from "./modules/feature-flag/feature-flag.module"
import { FeatureFlagService } from "./modules/feature-flag/feature-flag.service"
import { RoleModule } from "./modules/role/role.module"
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
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: join(__dirname, "../i18n"),
        watch: true,
      },
      resolvers: [
        new QueryResolver(["lang", "l"]),
        new HeaderResolver(["x-custom-lang"]),
        AcceptLanguageResolver,
      ],
      typesOutputPath: join(__dirname, "../../src/types/i18n.d.ts"),
    }),
    ScheduleModule.forRoot(),
    FeatureFlagModule,
    ValidatorModule,
    DatabaseModule,
    AuthModule,
    SessionModule,
    UserModule,
    RoleModule,
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
