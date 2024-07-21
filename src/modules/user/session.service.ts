import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { SessionEntity } from "./entities/session.entity"

@Injectable()
export class SessionService {
  @InjectRepository(SessionEntity)
  private readonly sessionRepository: Repository<SessionEntity>
}
