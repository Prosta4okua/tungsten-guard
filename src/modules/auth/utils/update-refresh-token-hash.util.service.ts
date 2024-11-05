import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { RedisService } from "../../redis/redis.service";

@Injectable()
export class UpdateRefreshTokenHashUtilService {
	constructor(private readonly redisService: RedisService) {}

	async handle(userId: string, refreshToken: string) {
		const hash = await bcrypt.hash(refreshToken, 10);

		this.redisService.insert(userId, hash);

		return hash;
	}
}
