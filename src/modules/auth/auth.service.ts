import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Dayjs } from "dayjs"
import { MoreThan, Repository } from "typeorm"
import { token } from "@/lib/token"
import { dayjs } from "@/lib/dayjs"
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

  @Inject()
  private readonly configService: ConfigService

  /**
   * Generates a token for the given credentials and user.
   * If session service is enabled, it checks if there is an active session for the user.
   * If an active session exists, it returns the session token.
   * Otherwise, it generates a new access token using the JWT service.
   *
   * @param credentials - The authentication credentials.
   * @param user - The user entity.
   * @param expiresIn - The expiration time for the token.
   * @returns A promise that resolves to the generated token.
   */
  private async makeToken(
    credentials: AuthCredentials,
    user: UserEntity,
    expiresIn: Dayjs,
  ): Promise<string> {
    const isEnabledSessionFeature = this.sessionService.isEnabled()

    if (isEnabledSessionFeature) {
      const currentSession = await this.sessionService.getSessionByUser(user, {
        where: { expiresAt: MoreThan(dayjs().toDate()) },
      })

      if (currentSession) {
        return currentSession.token
      }
    }

    const accessToken = await this.jwtService.sign(
      {
        email: credentials.identify,
        sub: user.id,
      },
      { expiresIn: expiresIn.unix() },
    )

    if (isEnabledSessionFeature) {
      await this.sessionService.createSession({
        user,
        token: accessToken,
        userAgent: credentials.metadata?.userAgent,
        expiresAt: expiresIn.toDate(),
      })
    }

    return accessToken
  }

  /**
   * Validates the given credentials.
   *
   * @param credentials - The authentication credentials to validate.
   * @returns A promise that resolves to an `AuthValidatedResult` object.
   * @throws Error if the user is not found.
   */
  async validate(credentials: AuthCredentials): Promise<AuthValidatedResult> {
    const user = await this.userService.findOneByEmail(credentials.identify)

    if (!user) throw new Error("User not found")

    return {
      isValid: await token.verify(credentials.password, user.password),
      data: user,
    }
  }

  async login(credentials: AuthCredentials): Promise<string> {
    const jwtExpiresIn = Number(this.configService.get("JWT_EXPIRES_IN"))

    const validated = await this.validate(credentials)

    if (!validated.isValid)
      throw new UnauthorizedException("Invalid credentials")

    const user = validated.data
    const expiresIn = dayjs().add(Number(jwtExpiresIn), "hour")

    const accessToken = await this.makeToken(credentials, user, expiresIn)

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
    const deletedSession = await this.sessionService.deleteSession(accessToken)

    if (!deletedSession) {
      throw new BadRequestException(
        "Can't sign out user cause session not found.",
      )
    }

    return deletedSession
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
