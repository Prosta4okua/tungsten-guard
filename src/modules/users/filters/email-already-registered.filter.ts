import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { EmailAlreadyRegisteredException } from "../exceptions/email-already-registered.exception";

@Catch(EmailAlreadyRegisteredException)
export class EmailAlreadyRegisteredFilter implements ExceptionFilter {
	catch(exception: EmailAlreadyRegisteredException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();

		response.status(status).json({
			statusCode: status,
			message: exception.getResponse(),
		});
	}
}
