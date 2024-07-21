import { Exclude } from "class-transformer"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity } from "@/lib/entity"
import { UserEntity } from "@/modules/user/entities/user.entity"

@Entity({
  name: "sessions",
})
export class SessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  @Exclude()
  token: string

  @Column({ name: "browser_name", nullable: true })
  browserName?: string

  @Column({ nullable: true })
  host?: string

  @Column({ type: "json", nullable: true })
  metadata?: object

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity
}
