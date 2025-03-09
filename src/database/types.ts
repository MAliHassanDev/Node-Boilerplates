import { Generated, Insertable, Kysely, Selectable, Updateable } from "kysely";

/* -------------------- Kysely-Database-instance ------------------ */
export type DatabaseInstance = Kysely<Database>;

/* -------------------- Database -------------------- */

export interface Database {
  user: UserTable;
}

/* -------------------- User-Table -------------------- */
export interface UserTable {
  readonly id: Generated<number>;
  readonly name: string;
  password: string;
  readonly email: string;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
