import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			enableDebugMessages: true,
			forbidUnknownValues: true,
		}),
	);

	app.use(helmet());
	app.enableCors();

	await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
