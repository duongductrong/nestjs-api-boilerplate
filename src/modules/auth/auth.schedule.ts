import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"
import { logger } from "@/lib/logger"
import { SessionService } from "../session/session.service"

@Injectable()
export class AuthScheduleService implements OnApplicationBootstrap {
  @Inject()
  private readonly sessionService: SessionService

  async onApplicationBootstrap() {
    await Promise.allSettled([this.sessionCleanup()])
  }

  @Cron("58 23 * * *")
  sessionCleanup() {
    logger.info("Cleanup session running.")
    this.sessionService.cleanup()
    logger.success("Cleanup session done.")
  }
}
