import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helper.js";
import { relations } from "drizzle-orm";
import { accountsTable } from "./accounts.js";

export const rolNameEnum = t.pgEnum("role_name", ["USER", "ADMIN"]);

export const roleTable = t.pgTable("role", {
  id: t.uuid().primaryKey().defaultRandom(),
  name: rolNameEnum().notNull().unique(),
  code: t.integer().notNull().unique(),
  description: t.text(),
  ...timestamps,
});

export const roleUsersRelation = relations(roleTable, ({ many }) => ({
  users: many(accountsTable),
}));
