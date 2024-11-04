import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/modules/drizzle/schema.ts",
	dialect: "postgresql",
	out: "./migrations/",
	migrations: {
		schema: "public",
	},
	dbCredentials: {
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: "localhost",
		port: 5432,
		ssl: false,
	},
});
