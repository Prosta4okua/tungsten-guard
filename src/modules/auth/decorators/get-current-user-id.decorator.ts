import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtPayloadType } from "../types/jwt-payload.type";

export const GetCurrentUserId = createParamDecorator(
	(_: undefined, context: ExecutionContext): string => {
		const request = context.switchToHttp().getRequest();
		const user = request.user as JwtPayloadType;

		return user.sub;
	},
);
