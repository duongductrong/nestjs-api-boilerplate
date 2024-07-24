import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { RoleEntity } from "./role.entity"

@Entity({ name: "abilities" })
export class AbilityEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  can: boolean

  @Column()
  subject: string

  @Column()
  action: string

  @ManyToMany(() => RoleEntity, (role) => role.abilities)
  @JoinTable({
    name: "role_abilities",
    joinColumn: { name: "ability_id" },
    inverseJoinColumn: { name: "role_id" },
  })
  roles: RoleEntity
}
