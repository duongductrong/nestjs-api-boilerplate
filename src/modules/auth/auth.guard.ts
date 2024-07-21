import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { Request } from "express"
import { Observable } from "rxjs"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const httpContext = context.switchToHttp()
      const req = httpContext.getRequest<Request>()
      const [bearer, token] = req.headers.authorization.split(" ")

      if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedException("Unauthorized")
      }

      // Verify token

      return true
    } catch (error) {
      throw new UnauthorizedException(error?.message || "Unauthorized")
    }
  }
}
