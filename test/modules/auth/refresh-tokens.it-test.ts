import {
	ForbiddenException,
	HttpStatus,
	INestApplication,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { RefreshTokensController } from "../../../src/modules/auth/controllers/refresh-tokens.controller";
import { RefreshTokenGuard } from "../../../src/modules/auth/guards/refresh-token.guard";
import { RefreshTokensService } from "../../../src/modules/auth/services/refresh-tokens.service";
import { Tokens } from "../../../src/modules/auth/types/tokens.type";

describe("RefreshTokensController (e2e)", () => {
	let app: INestApplication;
	let refreshTokensService: RefreshTokensService;

	const mockRefreshTokensService = {
		handle: jest.fn(),
	};

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [RefreshTokensController],
			providers: [
				{
					provide: RefreshTokensService,
					useValue: mockRefreshTokensService,
				},
			],
		})
			.overrideGuard(RefreshTokenGuard)
			.useValue({
				canActivate: jest.fn((context) => {
					const request = context.switchToHttp().getRequest();
					request.user = {
						sub: "1",
						email: "test@gmail.com",
						iat: 1730831850,
						exp: 1730832750,
						refreshToken: request.headers.authorization.split(" ")[1],
					};
					return true;
				}),
			})
			.compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		refreshTokensService =
			moduleFixture.get<RefreshTokensService>(RefreshTokensService);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("/auth/refresh (POST) - success", async () => {
		const userId = "1";
		const refreshToken = "valid-refresh-token";
		const tokens: Tokens = {
			accessToken: "access-token",
			refreshToken: "new-refresh-token",
		};

		mockRefreshTokensService.handle.mockResolvedValueOnce(tokens);

		const response = await request(app.getHttpServer())
			.post("/auth/refresh")
			.set("Authorization", `Bearer ${refreshToken}`)
			.send()
			.expect(HttpStatus.OK);

		expect(response.body).toEqual(tokens);
		expect(refreshTokensService.handle).toHaveBeenCalledWith(
			userId, // userId is set by the guard
			refreshToken, // This should match the value in the Authorization header
		);
	});

	it("/auth/refresh (POST) - invalid refresh token", async () => {
		const refreshToken = "invalid-refresh-token";

		mockRefreshTokensService.handle.mockRejectedValueOnce(
			new ForbiddenException("Access denied"),
		);

		const response = await request(app.getHttpServer())
			.post("/auth/refresh")
			.set("Authorization", `Bearer ${refreshToken}`)
			.send()
			.expect(HttpStatus.FORBIDDEN);

		expect(response.body).toEqual({
			statusCode: HttpStatus.FORBIDDEN,
			message: "Access denied",
			error: "Forbidden",
		});
		expect(refreshTokensService.handle).toHaveBeenCalledWith("1", refreshToken); // userId is now "1"
	});
});
