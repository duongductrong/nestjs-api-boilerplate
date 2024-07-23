import { Exclude } from "class-transformer"
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { BaseEntity } from "@/lib/entity"
import { UserEntity } from "@/modules/user/entities/user.entity"

@Entity({
  name: "sessions",
})
export class SessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Exclude()
  token: string

  @Column({ name: "user_agent", nullable: true })
  userAgent?: string

  @Column({ type: "json", nullable: true })
  metadata?: object

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  @Column({
    type: "timestamp",
    name: "expires_at",
    default: null,
    nullable: true,
  })
  expiresAt?: Date
}
