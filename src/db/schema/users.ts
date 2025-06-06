import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helper.js";
import { roleTable } from "./roles.js";
import { relations } from "drizzle-orm";

export const userTable = t.pgTable(
  "users",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    firstName: t.text().notNull(),
    lastName: t.text(),
    email: t.text().notNull(),
    password: t.text().notNull(),
    roleId: t
      .uuid()
      .notNull()
      .references(() => roleTable.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    ...timestamps,
  },
  table => [t.uniqueIndex("idx_email").on(table.email)],
);

export const userRoleRelation = relations(userTable, ({ one }) => ({
  role: one(roleTable, {
    fields: [userTable.roleId],
    references: [roleTable.id],
  }),
}));
