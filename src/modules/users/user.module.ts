import { Module } from "@nestjs/common";
import { DrizzleModule } from "../database/drizzle.module";
import { GetUserController } from "./controllers/get-user.controller";
import { CreateUserService } from "./services/create-user.service";
import { GetUserByEmailService } from "./services/get-user-by-email.service";
import { GetUserByIdService } from "./services/get-user-by-id.service";

@Module({
	imports: [DrizzleModule],
	controllers: [GetUserController],
	providers: [CreateUserService, GetUserByIdService, GetUserByEmailService],
	exports: [CreateUserService, GetUserByEmailService],
})
export class UserModule {}
