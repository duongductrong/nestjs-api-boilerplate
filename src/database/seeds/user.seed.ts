import "reflect-metadata"

import { faker } from "@faker-js/faker"
import { Seeder } from "@jorgebodega/typeorm-seeding"
import { DataSource } from "typeorm"
import { token } from "@/lib/token"
import { UserEntity } from "@/modules/user/entities/user.entity"
import { User } from "@/modules/user/schema/user.schema"

export default class UserSeeder extends Seeder {
  async run(dataSource: DataSource) {
    const pwd = await token.hash("123456")

    const users: Omit<User, "sessions" | "id">[] = Array.from({
      length: 10000,
    }).map((_, idx) => ({
      email: `${idx}${faker.internet.email()}`,
      password: pwd,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }))

    await dataSource.getRepository(UserEntity).save(users)
  }
}
