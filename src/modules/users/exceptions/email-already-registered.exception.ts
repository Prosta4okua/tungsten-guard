import { HttpException, HttpStatus } from "@nestjs/common";

export class EmailAlreadyRegisteredException extends HttpException {
	constructor() {
		super("Email already registered", HttpStatus.BAD_REQUEST);
	}
}
