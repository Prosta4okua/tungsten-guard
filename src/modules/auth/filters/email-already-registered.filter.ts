import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { InvalidJwtException } from "../exceptions/invalid-jwt.exception";

@Catch(InvalidJwtException)
export class EmailAlreadyRegisteredFilter implements ExceptionFilter {
	catch(exception: InvalidJwtException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();

		response.status(status).json({
			statusCode: status,
			message: exception.getResponse(),
		});
	}
}
