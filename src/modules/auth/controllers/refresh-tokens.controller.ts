import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from "@nestjs/common";
import { GetCurrentUserId } from "../decorators/get-current-user-id.decorator";
import { GetCurrentUser } from "../decorators/get-current-user.decorator";
import { Public } from "../decorators/public.decorator";
import { RefreshTokenGuard } from "../guards/refresh-token.guard";
import { RefreshTokensService } from "../services/refresh-tokens.service";
import { Tokens } from "../types/tokens.type";

@Controller("/auth")
export class RefreshTokensController {
	constructor(private readonly refreshTokensService: RefreshTokensService) {}

	@Public()
	@UseGuards(RefreshTokenGuard)
	@Post("/refresh")
	@HttpCode(HttpStatus.OK)
	async handle(
		@GetCurrentUserId() userId: string,
		@GetCurrentUser("refreshToken") refreshToken: string,
	): Promise<Tokens> {
		return this.refreshTokensService.handle(userId, refreshToken);
	}
}
