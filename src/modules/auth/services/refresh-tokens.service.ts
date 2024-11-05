import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { Tokens } from "../types/tokens.type";

import * as bcrypt from "bcrypt";
import { DRIZZLE } from "../../database/drizzle.module";
import { users } from "../../database/schema";
import { DrizzleDb } from "../../database/types/drizzle-db.type";
import { RedisService } from "../../redis/redis.service";
import { GetTokensUtilService } from "../utils/get-tokens.util.service";
import { UpdateRefreshTokenHashUtilService } from "../utils/update-refresh-token-hash.util.service";

@Injectable()
export class RefreshTokensService {
	constructor(
		@Inject(DRIZZLE) private readonly db: DrizzleDb,
		private readonly redisService: RedisService,
		private readonly getTokensUtilService: GetTokensUtilService,
		private readonly updateRefreshTokenHashUtilService: UpdateRefreshTokenHashUtilService,
	) {}

	async handle(userId: string, refreshToken: string): Promise<Tokens> {
		const user = await this.db.select().from(users).where(eq(users.id, userId));
		if (!user[0]) {
			throw new ForbiddenException("Access denied");
		}

		const { id, email } = user[0];

		const hashedRefreshToken = await this.redisService.get(userId);

		const doesRefreshTokenMatch = await bcrypt.compare(
			refreshToken,
			hashedRefreshToken,
		);
		if (!doesRefreshTokenMatch) {
			throw new ForbiddenException("Access denied");
		}

		const { accessToken, refreshToken: newRefreshToken } =
			await this.getTokensUtilService.handle(id, email);

		await this.updateRefreshTokenHashUtilService.handle(id, newRefreshToken);

		return { accessToken, refreshToken };
	}
}
