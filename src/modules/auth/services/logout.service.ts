import { Injectable } from "@nestjs/common";
import { RedisService } from "../../redis/redis.service";
import { InvalidJwtException } from "../exceptions/invalid-jwt.exception";

@Injectable()
export class LogoutService {
	constructor(private readonly redisService: RedisService) {}

	async handle(userId: string) {
		const result = await this.redisService.get(userId);

		if (!result) {
			throw new InvalidJwtException();
		}

		await this.redisService.delete(userId);
	}
}
