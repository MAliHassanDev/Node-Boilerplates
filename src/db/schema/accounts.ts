import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helper.js";
import { roleTable } from "./roles.js";
import { relations } from "drizzle-orm";

export const providerEnum = t.pgEnum("provider_enum", ["google", "local"]);

export const accountsTable = t.pgTable(
  "accounts",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    firstName: t.text().notNull(),
    lastName: t.text(),
    provider: providerEnum().notNull().default("local"),
    providerId: t.text(),
    email: t.text().notNull(),
    password: t.text(),
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

export const userRoleRelation = relations(accountsTable, ({ one }) => ({
  role: one(roleTable, {
    fields: [accountsTable.roleId],
    references: [roleTable.id],
  }),
}));
