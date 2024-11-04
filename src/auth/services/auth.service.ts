import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { DrizzleDB } from "src/database/drizzle/drizzle";
import { DRIZZLE } from "src/database/drizzle/drizzle.module";
import { users } from "src/database/schema";

import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { AuthDto } from "../dto/auth.dto";
import { Tokens } from "../types/tokens.type";

@Injectable()
export class AuthService {
	constructor(
		@Inject(DRIZZLE) private readonly db: DrizzleDB,
		private readonly jwtService: JwtService,
	) {}

	async signup(authDto: AuthDto): Promise<Tokens> {
		const { email, password } = authDto;

		const hash = await this.hashData(password);

		console.log("hash", hash);
		console.log(authDto);

		console.log("hehe", await this.db.select().from(users));

		const newUser = await this.db
			.insert(users)
			.values({ email, hashedPassword: hash })
			.returning()
			.execute();
		const { id } = newUser[0];

		const { accessToken, refreshToken } = await this.getTokens(id, email);

		await this.updateRefreshTokenHash(id, refreshToken);

		return { accessToken, refreshToken };
	}
	async signin(authDto: AuthDto): Promise<Tokens> {
		const { email, password } = authDto;

		const user = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email));
		const { hashedPassword, id } = user[0];

		if (!user) {
			throw new ForbiddenException("Access denied");
		}

		const doesPasswordMatch = await bcrypt.compare(password, hashedPassword);
		if (!doesPasswordMatch) {
			throw new ForbiddenException("Access denied");
		}

		const { accessToken, refreshToken } = await this.getTokens(id, email);

		await this.updateRefreshTokenHash(id, refreshToken);

		return { accessToken, refreshToken };
	}

	async refresh(userId: string, refreshToken: string): Promise<Tokens> {
		const user = await this.db.select().from(users).where(eq(users.id, userId));
		if (!user[0] || !user[0].hashedRefreshToken) {
			throw new ForbiddenException("Access denied");
		}

		const { id, email, hashedRefreshToken } = user[0];

		const doesRefreshTokenMatch = await bcrypt.compare(
			refreshToken,
			hashedRefreshToken,
		);
		if (!doesRefreshTokenMatch) {
			throw new ForbiddenException("Access denied");
		}

		const { accessToken, refreshToken: newRefreshToken } = await this.getTokens(
			id,
			email,
		);

		await this.updateRefreshTokenHash(id, newRefreshToken);

		return { accessToken, refreshToken };
	}

	async logout(userId: string) {
		// const statement = sql`select * from ${users} where ${users.id} = ${userId}`;
		// const res: postgres.RowList<Record<string, unknown>[]> =
		// 	await db.execute(statement);
		const statement = sql`
			UPDATE ${users}
			SET ${users.hashedRefreshToken} = NULL
			WHERE ${users.id} = ${userId} AND ${users.hashedRefreshToken} IS NOT NULL
			`;

		const res = await this.db.execute(statement);

		console.log("res", res);
		// await this.db
		// 	.update(users)
		// 	.set({ hashedRefreshToken: null })
		// 	.where(and(eq(users.id, userId), isNotNull(users.hashedRefreshToken)))
		// 	.execute();
	}

	async me() {}

	hashData(data: string) {
		return bcrypt.hash(data, 10);
	}

	async getTokens(userId: string, email: string) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{ sub: userId, email },
				{
					secret: "at-secret",
					expiresIn: "15m",
				},
			),
			this.jwtService.signAsync(
				{ sub: userId, email },
				{
					secret: "rt-secret",
					expiresIn: "1w",
				},
			),
		]);

		return { accessToken, refreshToken };
	}

	async updateRefreshTokenHash(userId: string, refreshToken: string) {
		/*
		working example
		const hash = await argon.hash(rt);
		await this.prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			hashedRt: hash,
		},
		});
		*/
		const hash = await this.hashData(refreshToken);

		await this.db
			.update(users)
			.set({ hashedRefreshToken: hash })
			.where(eq(users.id, userId))
			.execute();

		// await this.db
		// 	.update(users)
		// 	.set({ hashedRefreshToken: hash })
		// 	.where(sql`${users.id} = ${userId}`)
		// 	.execute();

		// const statement = sql`
		// 	UPDATE ${users}
		// 	SET ${users.hashedRefreshToken} = ${hash}
		// 	WHERE ${users.id} = ${userId} AND ${users.hashedRefreshToken} = NULL
		// 	`;

		// const res = await this.db.execute(statement);

		// console.log("res", res);
	}
}
