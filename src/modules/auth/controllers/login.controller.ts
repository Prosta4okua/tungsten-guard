import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Public } from "../decorators/public.decorator";
import { LoginDto } from "../dto/login.dto";
import { LoginService } from "../services/login.service";
import { Tokens } from "../types/tokens.type";

@Controller("/auth")
export class LoginController {
	constructor(private readonly loginService: LoginService) {}

	@Public()
	@Post("/login")
	@HttpCode(HttpStatus.OK)
	async login(@Body() authDto: LoginDto): Promise<Tokens> {
		return this.loginService.handle(authDto);
	}
}
