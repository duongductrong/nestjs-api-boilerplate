import { ApiProperty } from "@nestjs/swagger"
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator"
import { UserEntity } from "@/modules/user/entities/user.entity"
import { IsUnique } from "@/packages/validator"
import { AuthSignupPayload } from "../auth.service"

export class SignUpDto implements AuthSignupPayload {
  @IsString()
  @IsEmail()
  @IsUnique(
    { entity: UserEntity, field: "email" },
    { message: "Email already exists" },
  )
  @ApiProperty({ example: "your_email@example.com" })
  email: string

  @IsString()
  @IsStrongPassword()
  @ApiProperty({ example: "******" })
  password: string

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: "Doe" })
  firstName: string

  @IsString()
  @IsOptional()
  @IsStrongPassword()
  @ApiProperty({ example: "John" })
  lastName?: string
}
