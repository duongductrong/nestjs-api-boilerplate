import { User } from "./user.schema";

export class Session {
  id: string;

  user: User;

  token: string;

  browserName?: string;

  host?: string;

  metadata?: object;
}
