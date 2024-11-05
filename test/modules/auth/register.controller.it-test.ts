import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { RegisterController } from "../../../src/modules/auth/controllers/register.controller";
import { RegisterDto } from "../../../src/modules/auth/dto/register.dto";
import { RegisterService } from "../../../src/modules/auth/services/register.service";
import { CreateUserService } from "../../../src/modules/users/services/create-user.service";
import { EmailAlreadyRegisteredException } from "../../../src/modules/users/exceptions/email-already-registered.exception";

describe("RegisterController (e2e)", () => {
	let app: INestApplication;
	let createUserService: CreateUserService;

	const mockCreateUserService = {
		createUser: jest.fn(),
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [RegisterController],
			providers: [
				RegisterService,
				{
					provide: CreateUserService,
					useValue: mockCreateUserService,
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		createUserService = moduleFixture.get<CreateUserService>(CreateUserService);
	});

	afterAll(async () => {
		await app.close();
	});

	it("/auth/register (POST) - success", async () => {
		const registerDto: RegisterDto = {
			email: "test@example.com",
			password: "password123",
			fullName: "Test User",
		};

		mockCreateUserService.createUser.mockResolvedValueOnce({
			id: "1",
			email: registerDto.email,
			fullName: registerDto.fullName,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const response = await request(app.getHttpServer())
			.post("/auth/register")
			.send(registerDto)
			.expect(HttpStatus.CREATED);

		expect(response.body).toEqual({});
		expect(createUserService.createUser).toHaveBeenCalledWith(registerDto);
	});

	it("/auth/register (POST) - email already registered", async () => {
		const registerDto: RegisterDto = {
			email: "test@example.com",
			password: "password123",
			fullName: "Test User",
		};

		mockCreateUserService.createUser.mockRejectedValueOnce(
			new EmailAlreadyRegisteredException(),
		);

		const response = await request(app.getHttpServer())
			.post("/auth/register")
			.send(registerDto)
			.expect(HttpStatus.BAD_REQUEST);

		expect(response.body).toEqual({
			statusCode: HttpStatus.BAD_REQUEST,
			message: "Email already registered",
		});
		expect(createUserService.createUser).toHaveBeenCalledWith(registerDto);
	});
});
