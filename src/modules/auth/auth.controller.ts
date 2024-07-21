import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { AppVersion } from "@/app.enum"
import { ApiBuilder } from "@/lib/api/api.builder"
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
  async login(@Body() credentials: LoginDto) {
    try {
      const result = await this.authService.login(credentials)

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
}
