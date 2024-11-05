import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

export const createTestApplication = async (
	moduleFixture: TestingModule,
): Promise<INestApplication> => {
	const application = moduleFixture.createNestApplication();
	await application.init();

	return application;
};
