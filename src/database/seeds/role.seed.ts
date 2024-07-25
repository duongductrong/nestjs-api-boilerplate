import { Seeder } from "@jorgebodega/typeorm-seeding"
import { DataSource } from "typeorm"
import { logger } from "@/lib/logger"
import { AbilityEntity } from "@/modules/role/entities/ability.entity"
import { RoleEntity } from "@/modules/role/entities/role.entity"
import { resource } from "@/modules/role/role.resource"

export default class RoleSeeder extends Seeder {
  async run(dataSource: DataSource) {
    return
    const qr = dataSource.createQueryRunner()

    qr.startTransaction()
    try {
      const roleRepo = qr.manager.getRepository(RoleEntity)
      const abilityRepo = qr.manager.getRepository(AbilityEntity)

      // Create abilities
      const abilities = abilityRepo.create(Object.values(resource).flat(1))
      const createdAbilities = await abilityRepo.save(abilities)

      // Create role
      const role = roleRepo.create({
        name: "admin",
        description: "Administrator role",
      })
      const createdRole = await roleRepo.save(role)

      // Get created role and update its abilities
      const curRole = await roleRepo.findOne({
        where: { id: createdRole.id },
        relations: { abilities: true },
      })
      curRole.abilities = createdAbilities
      await roleRepo.save(curRole)

      qr.commitTransaction()
    } catch (e) {
      logger.error(e)
      qr.rollbackTransaction()
    }
  }
}
