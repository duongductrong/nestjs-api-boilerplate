import "reflect-metadata"

import { faker } from "@faker-js/faker"
import { Seeder } from "@jorgebodega/typeorm-seeding"
import { DataSource } from "typeorm"
import { UserEntity } from "@/modules/user/entities/user.entity"
import { token } from "@/lib/token"

export default class UserSeeder extends Seeder {
  async run(dataSource: DataSource) {
    return
    const pwd = await token.hash("123456")

    const users: Pick<
      UserEntity,
      "email" | "firstName" | "lastName" | "password"
    >[] = Array.from({
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
