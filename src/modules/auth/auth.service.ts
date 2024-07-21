import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { token } from "@/lib/token"
import { SessionService } from "../session/session.service"
import { UserEntity } from "../user/entities/user.entity"
import { UserService } from "../user/user.service"

export interface AuthCredentials {
  identify: string
  password: string

  metadata?: Record<"userAgent", any>
}

export interface AuthValidatedResult {
  isValid: boolean
  data: UserEntity
}

export interface AuthJwtSignPayload {
  email: UserEntity["email"]
  sub: UserEntity["id"]
}

export interface AuthSignupPayload
  extends Pick<UserEntity, "email" | "firstName" | "lastName" | "password"> {}

interface AuthServiceInterface {
  validate(credentials: AuthCredentials): Promise<AuthValidatedResult>
  login(credentials: AuthCredentials): Promise<string>
  signUp(payload: AuthSignupPayload): Promise<UserEntity>
  signOut(accessToken: string): Promise<boolean>
  // forgotPassword(): Promise<void>;
  // resetPassword(): Promise<void>;
  // verifyEmail(): Promise<void>;
  // resendEmailVerification(): Promise<void>;
  // changePassword(): Promise<void>;
  // changeEmail(): Promise<void>;
  // changeUsername(): Promise<void>;
}

@Injectable()
export class AuthService implements AuthServiceInterface {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  @Inject()
  private readonly userService: UserService

  @Inject()
  private readonly jwtService: JwtService

  @Inject()
  private readonly sessionService: SessionService

  async validate(credentials: AuthCredentials): Promise<AuthValidatedResult> {
    const user = await this.userService.findOneByEmail(credentials.identify)

    if (!user) throw new Error("User not found")

    return {
      isValid: await token.verify(credentials.password, user.password),
      data: user,
    }
  }

  async login(credentials: AuthCredentials): Promise<string> {
    const validated = await this.validate(credentials)

    if (!validated.isValid)
      throw new UnauthorizedException("Invalid credentials")

    const accessToken = await this.jwtService.sign({
      email: credentials.identify,
      sub: validated.data.id,
    })

    if (this.sessionService.isEnabled()) {
      await this.sessionService.createSession({
        token: accessToken,
        user: validated.data,
        userAgent: credentials.metadata?.userAgent,
      })
    }

    return accessToken
  }

  async signUp(payload: AuthSignupPayload): Promise<UserEntity> {
    const created = await this.userService.create({
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
    })

    return created
  }

  async signOut(accessToken: string): Promise<boolean> {
    console.log(accessToken)
    return true
  }

  // async forgotPassword() {
  //   // Send email with reset password link
  // }

  // async resetPassword() {
  //   // Update user password
  // }

  // async verifyEmail() {
  //   // Verify user email
  // }

  // async resendEmailVerification() {
  //   // Resend email verification
  // }

  // async changePassword() {
  //   // Change user password
  // }

  // async changeEmail() {
  //   // Change user email
  // }

  // async changeUsername() {
  //   // Change user username
  // }
}
