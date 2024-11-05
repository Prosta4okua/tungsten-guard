import { users } from "../../database/schema";

export type SelectUserType = typeof users.$inferSelect;
