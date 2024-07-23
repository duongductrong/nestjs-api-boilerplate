import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from "@nestjs/common"
import { ApiBadRequestResponse, ApiBearerAuth } from "@nestjs/swagger"
import { SessionEntity } from "../session/entities/session.entity"
import { UserEntity } from "../user/entities/user.entity"
import { AuthGuard } from "./auth.guard"

export const Auth = (...roles: string[]) =>
  applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiBadRequestResponse({ description: "Unauthorized" }),
  )

/**
 * @description Get the user from the request object
 * @returns {UserEntity}
 * @example
 * ```ts
 * @Get()
 * async getUser(@User() user: UserEntity) {
 *  return user
 * }
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest()?.local?.user as UserEntity,
)

/**
 * @description Get the session from the request object
 * @returns {Session}
 * @example
 * ```ts
 * @Get()
 * async getSession(@Session() session: Session) {
 *  return session
 * }
 * ```
 */
export const Session = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest()?.local?.session as SessionEntity,
)

export const Local = createParamDecorator(
  (data: "user" | "session", ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.local?.[data]
  },
)

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx
      .switchToHttp()
      .getRequest()
      .headers?.authorization?.split(" ")?.[1]
  },
)
