import validator from "validator";

export class Email {
	private readonly email: string;

	constructor(emailStr: string) {
		this.email = emailStr;
		if (!validator.isEmail(this.email)) {
			throw new Error('Invalid email address');
		}
	}

	public toString(): string {
		return this.email;
	}
}
