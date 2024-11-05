import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { GetCurrentUserId } from "../decorators/get-current-user-id.decorator";
import { LogoutService } from "../services/logout.service";

@Controller("/auth")
export class LogoutController {
	constructor(private readonly logoutService: LogoutService) {}

	@Post("/logout")
	@HttpCode(HttpStatus.OK)
	async logout(@GetCurrentUserId() userId: string) {
		return await this.logoutService.handle(userId);
	}
}
