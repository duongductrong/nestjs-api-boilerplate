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
import { Translations, TranslatorService } from "@/lib/i18n"
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
  refreshToken(accessToken: string): Promise<string>
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

  @Inject()
  private readonly translatorService: TranslatorService<Translations>

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
    credentials: Omit<AuthCredentials, "password">,
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

  private getTokenExpiryDate(): Dayjs {
    const jwtExpiresIn = Number(this.configService.get("JWT_EXPIRES_IN"))
    return dayjs().add(jwtExpiresIn, "hour")
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

    if (!user)
      throw new Error(this.translatorService.t("general.error.notFound"))

    return {
      isValid: await token.verify(credentials.password, user.password),
      data: user,
    }
  }

  async login(credentials: AuthCredentials): Promise<string> {
    const validated = await this.validate(credentials)

    if (!validated.isValid)
      throw new UnauthorizedException(
        this.translatorService.t("general.error.invalidCredentials"),
      )

    const user = validated.data
    const expiresIn = this.getTokenExpiryDate()

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
        this.translatorService.t("general.error.sessionNotFound"),
      )
    }

    return deletedSession
  }

  async refreshToken(accessToken: string): Promise<string> {
    const payload = this.jwtService.decode<AuthJwtSignPayload>(accessToken)

    if (!payload) {
      throw new BadRequestException(
        this.translatorService.t("general.error.invalidToken"),
      )
    }

    const session = await this.sessionService.getSessionByToken(accessToken)

    // If the session exists and the token is still alive, return the token
    if (session && dayjs(session.expiresAt).toDate() > dayjs().toDate()) {
      throw new BadRequestException(
        this.translatorService.t("general.error.tokenAlive"),
      )
    }
    // If the session exists and the token is expired, delete the session
    if (session && dayjs(session.expiresAt).toDate() < dayjs().toDate()) {
      this.sessionService.deleteSession(session)
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.sub, email: payload.email },
    })

    // If the user is not found, throw an error
    if (!user) {
      throw new BadRequestException(
        this.translatorService.t("general.error.notFound"),
      )
    }

    const expiresIn = this.getTokenExpiryDate()

    const newAccessToken = await this.makeToken(
      { identify: user.email },
      user,
      expiresIn,
    )

    return newAccessToken
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
