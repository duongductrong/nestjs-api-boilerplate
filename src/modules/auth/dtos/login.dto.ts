import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, IsStrongPassword } from "class-validator"
import { AuthCredentials } from "../auth.service"

export class LoginDto implements AuthCredentials {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: "your_email@example.com" })
  identify: string

  @IsString()
  @IsStrongPassword()
  @ApiProperty({ example: "your_password" })
  password: string
}
