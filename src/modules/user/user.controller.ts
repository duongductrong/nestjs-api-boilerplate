import { Controller, Inject } from "@nestjs/common"
import { UserService } from "./user.service"

@Controller("users")
export class UserController {
  @Inject() private readonly userService: UserService
}
