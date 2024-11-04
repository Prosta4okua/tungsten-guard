import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../schema";

export const DRIZZLE = Symbol("DRIZZLE");

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: DRIZZLE,
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const databaseUrl = `postgresql://${configService.get<string>("DB_USERNAME")}:${configService.get<string>("DB_PASSWORD")}@localhost:5432/${configService.get<string>("DB_NAME")}?sslmode=disable`;

				const pool = new Pool({
					connectionString: databaseUrl,
				});

				try {
					await pool.query("SELECT 1");
					console.log("Database connection established");
				} catch (error) {
					console.error("Database connection failed", error);
					throw error;
				}

				return drizzle(pool, { schema, casing: "camelCase" }) as NodePgDatabase<
					typeof schema
				>;
			},
		},
	],
	exports: [DRIZZLE],
})
export class DrizzleModule {}
