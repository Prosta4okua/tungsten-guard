import { TestingModuleBuilder, Test } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";

export const createBaseModuleFixture = (): TestingModuleBuilder => {
	return Test.createTestingModule({
		imports: [AppModule],
	});
};
