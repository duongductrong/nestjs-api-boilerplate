import { Controller } from "@nestjs/common"
import { AppVersion } from "@/app.enum"

@Controller({
  path: "roles",
  version: AppVersion.v1,
})
export class RoleController {}
