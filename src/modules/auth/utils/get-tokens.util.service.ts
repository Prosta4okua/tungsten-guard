import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class GetTokensUtilService {
	constructor(private readonly jwtService: JwtService) {}

	async handle(userId: string, email: string) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{ sub: userId, email },
				{
					secret: "at-secret",
					expiresIn: "15m",
				},
			),
			this.jwtService.signAsync(
				{ sub: userId, email },
				{
					secret: "rt-secret",
					expiresIn: "1w",
				},
			),
		]);

		return { accessToken, refreshToken };
	}
}
