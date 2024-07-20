import { Exclude } from "class-transformer";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Session } from "../schema/session.schema";
import { UserEntity } from "./user.entity";

@Entity({
  name: "sessions",
})
export class SessionEntity extends BaseEntity implements Session {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @Exclude()
  token: string;

  @Column({ name: "browser_name", nullable: true })
  browserName?: string;

  @Column({ nullable: true })
  host?: string;

  @Column({ type: "json", nullable: true })
  metadata?: object;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity;
}
