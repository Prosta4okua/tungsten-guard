import { users } from "../../database/schema";

export type InsertUserType = typeof users.$inferInsert;
