import { Module } from "@nestjs/common";
import { LoginController } from "../../src/modules/auth/controllers/login.controller";
import { LogoutController } from "../../src/modules/auth/controllers/logout.controller";
import { RefreshTokensController } from "../../src/modules/auth/controllers/refresh-tokens.controller";
import { RegisterController } from "../../src/modules/auth/controllers/register.controller";

@Module({
	providers: [
		{
			provide: LoginController,
			useValue: null,
		},
		{
			provide: RefreshTokensController,
			useValue: null,
		},
		{
			provide: RegisterController,
			useValue: null,
		},
		{
			provide: LogoutController,
			useValue: null,
		},
	],
	exports: [
		LoginController,
		RefreshTokensController,
		RegisterController,
		LogoutController,
	],
})
export class TestUserModule {}
