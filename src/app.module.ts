import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { AccessTokenGuard } from "./modules/auth/guards/access-token.guard";
import { RedisModule } from "./modules/redis/redis.module";
import { UserModule } from "./modules/users/user.module";
import { DrizzleModule } from "./modules/database/drizzle.module";

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			envFilePath: ".env",
		}),
		DrizzleModule,
		RedisModule,
		UserModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: "APP_GUARD",
			useClass: AccessTokenGuard,
		},
	],
})
export class AppModule {}
