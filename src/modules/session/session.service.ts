import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserEntity } from "../user/entities/user.entity"
import { SessionEntity } from "./entities/session.entity"

@Injectable()
export class SessionService {
  @InjectRepository(SessionEntity)
  private readonly sessionRepository: Repository<SessionEntity>

  async createSession(user: UserEntity): Promise<SessionEntity> {
    const session = this.sessionRepository.create({ user })

    return this.sessionRepository.save(session)
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
