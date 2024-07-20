import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;

  create() {
    const entity = this.userRepository.create({
      email: "test@gmail.com",
      firstName: "first",
      lastName: "last",
      password: "password",
    });

    return this.userRepository.save(entity);
  }
}
