import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

const timestamps = {
	createdAt: t.timestamp("created_at").defaultNow().notNull(),
	updatedAt: t.timestamp("updated_at").defaultNow().notNull(),
};

export const users = table("users", {
	id: t.uuid().defaultRandom().primaryKey(),
	email: t.varchar("email").notNull().unique(),
	hashedPassword: t.varchar().notNull(),
	hashedRefreshToken: t.varchar(),

	...timestamps,
});
