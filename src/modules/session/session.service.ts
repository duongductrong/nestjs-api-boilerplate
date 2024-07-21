import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { SessionEntity } from "./entities/session.entity"

export interface CreateSessionPayload
  extends Pick<SessionEntity, "userAgent" | "token" | "user" | "metadata"> {}

@Injectable()
export class SessionService {
  @InjectRepository(SessionEntity)
  private readonly sessionRepository: Repository<SessionEntity>

  async createSession(payload: CreateSessionPayload): Promise<SessionEntity> {
    const session = this.sessionRepository.create(payload)

    return this.sessionRepository.save(session)
  }

  async deleteSession(session: string | SessionEntity): Promise<boolean> {
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

  async getSessionByToken(
    token: SessionEntity["token"],
  ): Promise<SessionEntity> {
    return this.sessionRepository.findOne({ where: { token } })
  }

  async getSessionById(id: SessionEntity["id"]): Promise<SessionEntity> {
    return this.sessionRepository.findOne({ where: { id } })
  }
}
