import { users } from "../../database/schema";

export type NewUser = typeof users.$inferInsert;
