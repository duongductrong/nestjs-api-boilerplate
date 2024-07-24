import { Exclude, Expose } from "class-transformer"
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { BaseEntity } from "@/lib/entity"
import { RoleEntity } from "@/modules/role/entities/role.entity"
import { SessionEntity } from "@/modules/session/entities/session.entity"

@Entity({
  name: "users",
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "fist_name", nullable: true })
  firstName?: string

  @Column({ name: "last_name", nullable: true })
  lastName?: string

  @Column({ unique: true })
  email: string

  @Column()
  @Exclude()
  password: string

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[]

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: "role_id" })
  role: RoleEntity

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  constructor(partial: Partial<UserEntity>) {
    super()
    Object.assign(this, partial)
  }
}
