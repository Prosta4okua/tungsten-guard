import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE } from "../../database/drizzle.module";
import { DrizzleDb } from "../../database/types/drizzle-db.type";

@Injectable()
export class GetUserByIdService {
	constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

	async handle(userId: string) {
		return await this.db.query.users.findFirst({
			columns: {
				id: true,
				email: true,
				fullName: true,
				createdAt: true,
				updatedAt: true,
			},
			where: (users, { eq }) => eq(users.id, userId),
		});
	}
}
