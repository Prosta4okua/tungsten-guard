import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Public } from "../decorators/public.decorator";
import { RegisterDto } from "../dto/register.dto";
import { RegisterService } from "../services/register.service";

@Controller("/auth")
export class RegisterController {
	constructor(private readonly registerService: RegisterService) {}

	@Public()
	@Post("/register")
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() registerDto: RegisterDto): Promise<void> {
		await this.registerService.handle(registerDto);
	}
}
