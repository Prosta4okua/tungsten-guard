import { type ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetCurrentUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();

		if (!data) return request.user;

		// @ts-ignore
		return request.user[data];
	},
);
