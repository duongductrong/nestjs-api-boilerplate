import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  InternalServerErrorException,
  Post,
  Put,
  UnauthorizedException,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { I18n } from "nestjs-i18n"
import { AppVersion } from "@/app.enum"
import { Translations, TranslatorContext, TranslatorService } from "@/lib/i18n"
import { ApiBuilder } from "@/packages/api"
import { UserEntity } from "../user/entities/user.entity"
import { Auth, Token, User } from "./auth.decorator"
import { AuthApi, AuthPath } from "./auth.enum"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dtos/login.dto"
import { SignUpDto } from "./dtos/signup.dto"

@ApiTags(AuthApi.Tags)
@Controller({
  path: AuthApi.Path,
  version: AppVersion.v1,
})
export class AuthController {
  @Inject()
  private readonly authService: AuthService

  @Inject() private readonly translator: TranslatorService<Translations>

  @Auth()
  @Get(AuthPath.Me)
  async me(@User() user: UserEntity, @I18n() translator: TranslatorContext) {
    return ApiBuilder.create()
      .setData(user)
      .setMessage(translator.t("general.success.retrieved"))
      .build()
  }

  @Post(AuthPath.Login)
  async login(@Body() credentials: LoginDto, @Headers() headers: any) {
    const userAgent = headers["user-agent"]
    try {
      const result = await this.authService.login({
        identify: credentials.identify,
        password: credentials.password,
        metadata: { userAgent },
      })

      return ApiBuilder.create()
        .setData({
          accessToken: result,
        })
        .setMessage(this.translator.t("general.success.operation"))
        .build()
    } catch (error) {
      throw new UnauthorizedException(
        error?.message || this.translator.t("general.error.invalidCredentials"),
      )
    }
  }

  @Post(AuthPath.Signup)
  async signup(@Body() payload: SignUpDto) {
    try {
      const result = await this.authService.signUp(payload)

      return ApiBuilder.create()
        .setData(result)
        .setMessage(this.translator.t("general.success.operation"))
        .build()
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || this.translator.t("general.error.somethingWentWrong"),
      )
    }
  }

  @Auth()
  @Post(AuthPath.Logout)
  async logout(@Token() token: string) {
    try {
      await this.authService.signOut(token)

      return ApiBuilder.create()
        .setData({})
        .setMessage(this.translator.t("general.success.operation"))
        .build()
    } catch (e) {
      throw new BadRequestException(e?.message)
    }
  }

  @Put(AuthPath.Refresh)
  async refresh(@Token() token: string) {
    const result = await this.authService.refreshToken(token)

    return ApiBuilder.create()
      .setData({
        accessToken: result,
      })
      .setMessage(this.translator.t("general.success.operation"))
      .build()
  }
}
