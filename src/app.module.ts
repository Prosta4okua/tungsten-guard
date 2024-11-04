import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AccessTokenGuard } from "./auth/common/guards/access-token.guard";
import { DrizzleModule } from "./database/drizzle/drizzle.module";

@Module({
	imports: [
		DrizzleModule,
		RedisModule.forRoot({
			readyLog: true,
			config: {
				host: "localhost",
				port: 6379,
				password: "authpassword",
			},
		}),
		AuthModule,
		ConfigModule.forRoot({
			envFilePath: ".env",
		}),
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
