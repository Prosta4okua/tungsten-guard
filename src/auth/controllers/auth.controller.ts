import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from "@nestjs/common";
import { GetCurrentUserId } from "../common/decorators/get-current-user-id.decorator";
import { GetCurrentUser } from "../common/decorators/get-current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import { RefreshTokenGuard } from "../common/guards/refresh-token.guard";
import { AuthDto } from "../dto/auth.dto";
import { AuthService } from "../services/auth.service";
import type { Tokens } from "../types/tokens.type";

@Controller("/auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post("/register")
	@HttpCode(HttpStatus.CREATED)
	async signup(@Body() authDto: AuthDto): Promise<Tokens> {
		return this.authService.signup(authDto);
	}

	@Public()
	@Post("/login")
	@HttpCode(HttpStatus.OK)
	async signin(@Body() authDto: AuthDto): Promise<Tokens> {
		return this.authService.signin(authDto);
	}

	@Public()
	@UseGuards(RefreshTokenGuard)
	@Post("/refresh")
	@HttpCode(HttpStatus.OK)
	async refresh(
		@GetCurrentUserId() userId: string,
		@GetCurrentUser("refreshToken") refreshToken: string,
	): Promise<Tokens> {
		return this.authService.refresh(userId, refreshToken);
	}

	@Post("/logout")
	@HttpCode(HttpStatus.OK)
	async logout(@GetCurrentUserId() userId: string) {
		return await this.authService.logout(userId);
	}

	@Post("/me")
	@HttpCode(HttpStatus.OK)
	me() {
		this.authService.me();
	}
}
