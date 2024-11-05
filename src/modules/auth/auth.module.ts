import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../users/user.module";
import { LoginController } from "./controllers/login.controller";
import { LogoutController } from "./controllers/logout.controller";
import { RefreshTokensController } from "./controllers/refresh-tokens.controller";
import { RegisterController } from "./controllers/register.controller";
import { LoginService } from "./services/login.service";
import { LogoutService } from "./services/logout.service";
import { RefreshTokensService } from "./services/refresh-tokens.service";
import { RegisterService } from "./services/register.service";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { GetTokensUtilService } from "./utils/get-tokens.util.service";
import { UpdateRefreshTokenHashUtilService } from "./utils/update-refresh-token-hash.util.service";
import { DrizzleModule } from "../database/drizzle.module";

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "1h" },
		}),
		DrizzleModule,
		UserModule,
	],
	controllers: [
		LoginController,
		RefreshTokensController,
		RegisterController,
		LogoutController,
	],
	providers: [
		AccessTokenStrategy,
		RefreshTokenStrategy,
		LoginService,
		RefreshTokensService,
		RegisterService,
		LogoutService,
		GetTokensUtilService,
		UpdateRefreshTokenHashUtilService,
	],
})
export class AuthModule {}
