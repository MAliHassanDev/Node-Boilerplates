import { roleTable } from "../../../db/schema/index.js";

export type Role = typeof roleTable.$inferSelect;
export type NewRole = typeof roleTable.$inferInsert;
export type RoleUpdate = Partial<NewRole>;
