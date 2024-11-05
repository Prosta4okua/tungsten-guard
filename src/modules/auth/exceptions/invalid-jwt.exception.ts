import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidJwtException extends HttpException {
	constructor() {
		super("Invalid jwt", HttpStatus.BAD_REQUEST);
	}
}
