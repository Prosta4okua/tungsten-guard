import {
	IsEmail,
	IsNotEmpty,
	IsStrongPassword,
	MaxLength,
} from "class-validator";

export class AuthDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MaxLength(30)
	@IsStrongPassword(
		{
			minLength: 8,
			minLowercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			minUppercase: 1,
		},
		{
			message:
				"Your password is too weak. It must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol",
		},
	)
	password: string;
}
