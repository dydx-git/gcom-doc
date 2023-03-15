export class Email {
	private readonly email: string;
	private static readonly regex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

	constructor(emailStr: string) {
		this.email = emailStr;
		if (!Email.validate(emailStr)) {
			throw new Error('Invalid email address');
		}
	}

	static validate(email: string): boolean {
		return Email.regex.test(email);
	}

	public toString(): string {
		return this.email;
	}
}
