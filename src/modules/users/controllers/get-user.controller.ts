import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { GetUserByIdService } from "../services/get-user-by-id.service";
import { GetCurrentUserId } from "../../auth/decorators/get-current-user-id.decorator";

@Controller("users")
export class GetUserController {
	constructor(private readonly getUserByIdService: GetUserByIdService) {}

	@Get("/me")
	@HttpCode(HttpStatus.OK)
	async handle(@GetCurrentUserId() userId: string) {
		return await this.getUserByIdService.handle(userId);
	}
}
