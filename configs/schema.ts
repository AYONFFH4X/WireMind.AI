import { Description } from "@radix-ui/react-dialog";
import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";
import { describe } from "node:test";
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer().default(0)
});

export const WireFrameToCodeTable = pgTable("wireframeToCode", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uid:varchar().notNull(),
    imageUrl:varchar(),
    model: varchar(),
    description: varchar(),
    code:json(),
    createdBy: varchar()
});