import {
  BaseEntity as BaseEntityPrimitive,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

export interface IBaseEntity {
  createdAt?: Date
  updatedAt?: Date
}

export class BaseEntity extends BaseEntityPrimitive implements IBaseEntity {
  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date
}
