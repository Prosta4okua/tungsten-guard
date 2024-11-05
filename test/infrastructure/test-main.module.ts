import { Module } from "@nestjs/common";
import { TestUserModule } from "./test-user.module";

@Module({
	imports: [TestUserModule],
	exports: [TestUserModule],
})
export class TestMainModule {}
