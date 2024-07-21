import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { ApiBadRequestResponse, ApiBearerAuth } from "@nestjs/swagger"
import { AuthGuard } from "./auth.guard"

export const Auth = (...roles: string[]) =>
  applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiBadRequestResponse({ description: "Unauthorized" }),
  )
