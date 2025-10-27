import {
  bigint,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const userStatusEnum = pgEnum("issue_status", [
  "wait",
  "fixing",
  "complete",
]);

export const issueTable = pgTable("issues", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  poster: text("poster").notNull(),
  createDate: date("create_date", { mode: "string" }).notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  state: userStatusEnum("state").notNull().default("wait"),
  fixedDate: date("fixed_date", { mode: "string" }),
  staffId: bigint("staff_id", { mode: "number" }),
});

export const staffTable = pgTable("staff", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity()
    .notNull(),
  staffName: text("staff_name").notNull(),
  staffRole: text("staff_role").notNull(),
  password: text("password").notNull(),
});
