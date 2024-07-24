import { UserEntity } from "../user/entities/user.entity"
import { AbilityEntity } from "./entities/ability.entity"
import { RoleEntity } from "./entities/role.entity"

export const resource = {
  user: [
    {
      name: "create",
      can: true,
      subject: UserEntity.name,
      action: "create",
    },
    {
      name: "read",
      can: true,
      subject: UserEntity.name,
      action: "read",
    },
    {
      name: "update",
      can: true,
      subject: UserEntity.name,
      action: "update",
    },
    {
      name: "delete",
      can: true,
      subject: UserEntity.name,
      action: "delete",
    },
  ],
  role: [
    {
      name: "create",
      can: true,
      subject: RoleEntity.name,
      action: "create",
    },
    {
      name: "read",
      can: true,
      subject: RoleEntity.name,
      action: "read",
    },
    {
      name: "update",
      can: true,
      subject: RoleEntity.name,
      action: "update",
    },
    {
      name: "delete",
      can: true,
      subject: RoleEntity.name,
      action: "delete",
    },
  ],
  ability: [
    {
      name: "create",
      can: true,
      subject: AbilityEntity.name,
      action: "create",
    },
    {
      name: "read",
      can: true,
      subject: AbilityEntity.name,
      action: "read",
    },
    {
      name: "update",
      can: true,
      subject: AbilityEntity.name,
      action: "update",
    },
    {
      name: "delete",
      can: true,
      subject: AbilityEntity.name,
      action: "delete",
    },
  ],
}
