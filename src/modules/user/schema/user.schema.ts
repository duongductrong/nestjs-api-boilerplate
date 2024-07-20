import { Session } from "./session.schema";

export class User {
  id: number;

  firstName?: string;

  lastName?: string;

  email: string;

  password: string;

  sessions: Session[];
}
