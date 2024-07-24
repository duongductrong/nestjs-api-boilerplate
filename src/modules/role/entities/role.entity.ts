import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { AbilityEntity } from "./ability.entity"
import { UserEntity } from "@/modules/user/entities/user.entity"
import { BaseEntity } from "@/lib/entity"

@Entity({ name: "roles" })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ comment: "Role name" })
  name: string

  @Column({ comment: "Role description", nullable: true })
  description?: string

  @ManyToMany(() => AbilityEntity, (ability) => ability.roles)
  @JoinTable({
    name: "role_abilities",
    joinColumn: { name: "role_id" },
    inverseJoinColumn: { name: "ability_id" },
  })
  abilities: AbilityEntity[]

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[]
}
