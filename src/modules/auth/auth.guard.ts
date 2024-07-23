import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { set } from "lodash"
import { logger } from "@/lib/logger"
import { SessionEntity } from "../session/entities/session.entity"
import { SessionService } from "../session/session.service"
import { UserService } from "../user/user.service"
import { AuthJwtSignPayload } from "./auth.service"

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject() private readonly jwtService: JwtService

  @Inject() private readonly userService: UserService

  @Inject() private readonly sessionService: SessionService

  async verifyingToken(token: string, request: Request) {
    const verified =
      await this.jwtService.verifyAsync<AuthJwtSignPayload>(token)

    let session: SessionEntity | null = null
    const user = await this.userService.findOne(verified.sub)

    // Check user is exist
    if (!user) throw new UnauthorizedException("Unauthorized")

    // Check session is enabled & exist
    if (this.sessionService.isEnabled()) {
      session = await this.sessionService.getSessionByUser(user)

      if (!session) throw new UnauthorizedException("Unauthorized")

      // Set session to request
      set(request, "local.session", session)
    }

    // Set user to request
    set(request, "local.user", user)

    return { user, session }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const httpContext = context.switchToHttp()
      const req = httpContext.getRequest<Request>()
      const [bearer, token] = req.headers.authorization.split(" ")

      if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedException("Unauthorized")
      }

      await this.verifyingToken(token, req)

      return true
    } catch (error) {
      logger.error(error)
      throw new UnauthorizedException("Token is invalid or expired")
    }
  }
}
