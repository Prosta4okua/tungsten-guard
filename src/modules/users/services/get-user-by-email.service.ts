import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE } from "../../database/drizzle.module";
import { DrizzleDb } from "../../database/types/drizzle-db.type";

@Injectable()
export class GetUserByEmailService {
	constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

	async handle(email: string) {
		return await this.db.query.users.findFirst({
			columns: {
				id: true,
				email: true,
				fullName: true,
				hashedPassword: true,
				createdAt: true,
				updatedAt: true,
			},
			where: (users, { eq }) => eq(users.email, email),
		});
	}
}
