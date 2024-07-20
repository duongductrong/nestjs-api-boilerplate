import "reflect-metadata";

import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { User } from "@/modules/user/schema/user.schema";

export default class UserSeeder extends Seeder {
  async run(dataSource: DataSource) {
    const users: Omit<User, "sessions" | "id">[] = Array.from({
      length: 10000,
    }).map((_, idx) => ({
      email: `${idx}${faker.internet.email()}`,
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }));

    await dataSource.getRepository(UserEntity).save(users);
  }
}
