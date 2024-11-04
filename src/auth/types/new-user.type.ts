import type { users } from "src/database/schema";

export type NewUser = typeof users.$inferInsert;
