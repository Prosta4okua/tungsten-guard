import { ForbiddenException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UpdateRefreshTokenHashUtilService } from "../utils/update-refresh-token-hash.util.service";
import { GetUserByEmailService } from "../../users/services/get-user-by-email.service";
import { LoginDto } from "../dto/login.dto";
import { Tokens } from "../types/tokens.type";
import { GetTokensUtilService } from "../utils/get-tokens.util.service";

@Injectable()
export class LoginService {
	constructor(
		private readonly getUserByEmailService: GetUserByEmailService,
		private readonly getTokensUtilService: GetTokensUtilService,
		private readonly updateRefreshTokenHashUtilService: UpdateRefreshTokenHashUtilService,
	) {}

	async handle(authDto: LoginDto): Promise<Tokens> {
		const { email, password } = authDto;

		const user = await this.getUserByEmailService.handle(email);

		if (!user) {
			throw new ForbiddenException("Access denied");
		}

		const { hashedPassword, id } = user;

		const doesPasswordMatch = await bcrypt.compare(password, hashedPassword);
		if (!doesPasswordMatch) {
			throw new ForbiddenException("Access denied");
		}

		const { accessToken, refreshToken } =
			await this.getTokensUtilService.handle(id, email);

		await this.updateRefreshTokenHashUtilService.handle(id, refreshToken);

		return { accessToken, refreshToken };
	}
}
