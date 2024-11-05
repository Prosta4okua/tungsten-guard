import { Test, TestingModule } from "@nestjs/testing";
import { LogoutController } from "../../../src/modules/auth/controllers/logout.controller";
import { LogoutService } from "../../../src/modules/auth/services/logout.service";

describe("LogoutController", () => {
	let controller: LogoutController;
	let logoutService: LogoutService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LogoutController],
			providers: [
				{
					provide: LogoutService,
					useValue: {
						handle: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<LogoutController>(LogoutController);
		logoutService = module.get<LogoutService>(LogoutService);
	});

	it("/auth/logout (POST) - successfull logout", async () => {
		const userId = "user-123";

		await controller.logout(userId);

		expect(logoutService.handle).toHaveBeenCalledWith(userId);
	});
});
