import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { DRIZZLE } from "../../database/drizzle.module";
import { PostgresErrorEnum } from "../../database/enums/postgres-error.enum";
import { users } from "../../database/schema";
import { DrizzleDb } from "../../database/types/drizzle-db.type";
import { CreateUserDto } from "../dto/create-user.dto";
import { EmailAlreadyRegisteredException } from "../exceptions/email-already-registered.exception";
import { SelectUserType } from "../types/select-user.type";

@Injectable()
export class CreateUserService {
	constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

	async createUser(createUserDto: CreateUserDto): Promise<SelectUserType> {
		const { email, password, fullName } = createUserDto;

		const hashedPassword = await bcrypt.hash(password, 10);

		try {
			const newUser = await this.db
				.insert(users)
				.values({ email, hashedPassword, fullName })
				.returning()
				.execute();

			return newUser[0];
		} catch (error) {
			if (error.code === PostgresErrorEnum.UNIQUE_VIOLATION) {
				throw new EmailAlreadyRegisteredException();
			}
		}
	}
}
