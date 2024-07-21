import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FeatureFlagScope } from "../feature-flag/feature-flag.enum"
import { FeatureFlagService } from "../feature-flag/feature-flag.service"
import { SessionEntity } from "./entities/session.entity"

export interface CreateSessionPayload
  extends Pick<SessionEntity, "userAgent" | "token" | "user" | "metadata"> {}

@Injectable()
export class SessionService {
  @InjectRepository(SessionEntity)
  private readonly sessionRepository: Repository<SessionEntity>

  @Inject()
  private readonly featureFlagService: FeatureFlagService

  @Inject()
  private readonly configService: ConfigService

  get config() {
    return {
      maxSize: Number(this.configService.get<number>("SESSION_MAX_SIZE")),
    }
  }

  isEnabled(): boolean {
    return this.featureFlagService.isEnabled(FeatureFlagScope.Session)
  }

  checkEnabledOrThrow() {
    if (!this.isEnabled()) throw new Error("Session feature is disabled")
  }

  async getSessionByToken(
    token: SessionEntity["token"],
  ): Promise<SessionEntity> {
    this.checkEnabledOrThrow()

    return this.sessionRepository.findOne({ where: { token } })
  }

  async getSessionById(id: SessionEntity["id"]): Promise<SessionEntity> {
    this.checkEnabledOrThrow()

    return this.sessionRepository.findOne({ where: { id } })
  }

  async getSessionByUser(
    user: SessionEntity["user"] | SessionEntity["user"]["id"],
  ): Promise<SessionEntity | null> {
    this.checkEnabledOrThrow()

    const userId = typeof user === "object" ? user.id : user
    return this.sessionRepository.findOne({ where: { user: { id: userId } } })
  }

  async createSession(payload: CreateSessionPayload): Promise<SessionEntity> {
    this.checkEnabledOrThrow()

    const curSessionSize = await this.sessionRepository.count({
      where: { user: { id: payload.user.id } },
    })

    if (this.config.maxSize !== -1 && curSessionSize > this.config.maxSize) {
      throw new Error("Session limit exceeded")
    }

    const session = this.sessionRepository.create(payload)

    return this.sessionRepository.save(session)
  }

  async deleteSession(session: string | SessionEntity): Promise<boolean> {
    this.checkEnabledOrThrow()

    const criteria = session instanceof SessionEntity ? session.id : session

    const ok = await this.sessionRepository
      .createQueryBuilder("session")
      .delete()
      .from(SessionEntity)
      .where("session.token = :token", { token: criteria })
      .orWhere("session.id = :id", { id: criteria })
      .execute()

    return !!ok.affected
  }
}
