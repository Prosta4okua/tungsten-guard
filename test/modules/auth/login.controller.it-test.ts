import {
	ForbiddenException,
	HttpStatus,
	INestApplication,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { LoginController } from "../../../src/modules/auth/controllers/login.controller";
import { LoginDto } from "../../../src/modules/auth/dto/login.dto";
import { LoginService } from "../../../src/modules/auth/services/login.service";
import { Tokens } from "../../../src/modules/auth/types/tokens.type";

describe("LoginController (e2e)", () => {
	let app: INestApplication;
	let loginService: LoginService;

	const mockLoginService = {
		handle: jest.fn(),
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [LoginController],
			providers: [
				{
					provide: LoginService,
					useValue: mockLoginService,
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		loginService = moduleFixture.get<LoginService>(LoginService);
	});

	afterAll(async () => {
		await app.close();
	});

	it("/auth/login (POST) - success", async () => {
		const loginDto: LoginDto = {
			email: "test@example.com",
			password: "password123",
		};

		const tokens: Tokens = {
			accessToken: "access-token",
			refreshToken: "refresh-token",
		};

		mockLoginService.handle.mockResolvedValueOnce(tokens);

		const response = await request(app.getHttpServer())
			.post("/auth/login")
			.send(loginDto)
			.expect(HttpStatus.OK);

		expect(response.body).toEqual(tokens);
		expect(loginService.handle).toHaveBeenCalledWith(loginDto);
	});

	it("/auth/login (POST) - invalid credentials", async () => {
		const loginDto: LoginDto = {
			email: "test@example.com",
			password: "wrongpassword",
		};

		mockLoginService.handle.mockRejectedValueOnce(
			new ForbiddenException("Access denied"),
		);

		const response = await request(app.getHttpServer())
			.post("/auth/login")
			.send(loginDto)
			.expect(HttpStatus.FORBIDDEN);

		expect(response.body).toEqual({
			statusCode: HttpStatus.FORBIDDEN,
			message: "Access denied",
			error: "Forbidden",
		});
		expect(loginService.handle).toHaveBeenCalledWith(loginDto);
	});
});
