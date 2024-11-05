import { Injectable } from "@nestjs/common";
import { CreateUserService } from "../../users/services/create-user.service";
import { RegisterDto } from "../dto/register.dto";

@Injectable()
export class RegisterService {
	constructor(private readonly createUserService: CreateUserService) {}

	async handle(authDto: RegisterDto): Promise<void> {
		await this.createUserService.createUser(authDto);
	}
}
