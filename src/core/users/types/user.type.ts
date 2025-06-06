import { userTable } from "../../../db/schema/index.js";

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;
export type UserUpdate = Partial<NewUser>;
