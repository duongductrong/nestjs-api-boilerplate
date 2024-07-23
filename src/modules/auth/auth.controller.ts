import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Inject,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { AppVersion } from "@/app.enum"
import { ApiBuilder } from "@/packages/api"
import { Auth, Token } from "./auth.decorator"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dtos/login.dto"
import { SignUpDto } from "./dtos/signup.dto"

@ApiTags("Auth")
@Controller({
  path: "auth",
  version: AppVersion.v1,
})
export class AuthController {
  @Inject()
  private readonly authService: AuthService

  @Post("login")
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
        .setMessage("Login successful")
        .build()
    } catch (error) {
      throw new UnauthorizedException(error?.message || "Invalid credentials")
    }
  }

  @Post("signup")
  async signup(@Body() payload: SignUpDto) {
    try {
      const result = await this.authService.signUp(payload)

      return ApiBuilder.create()
        .setData(result)
        .setMessage("Signup successful")
        .build()
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || "Something went wrong",
      )
    }
  }

  @Auth()
  @Post("logout")
  async logout(@Token() token: string) {
    try {
      await this.authService.signOut(token)

      return ApiBuilder.create()
        .setData({})
        .setMessage("Logout successful")
        .build()
    } catch (e) {
      throw new BadRequestException(e?.message)
    }
  }
}
