import { Exclude, Expose } from "class-transformer"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity } from "@/lib/entity"
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

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  constructor(partial: Partial<UserEntity>) {
    super()
    Object.assign(this, partial)
  }
}
