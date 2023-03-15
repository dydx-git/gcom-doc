export class Phone {
	private readonly phone: string;
	private static readonly regex = /^\d{3}-\d{3}-\d{4}$/;

	constructor(phoneStr: string) {
		this.phone = phoneStr;
		if (!Phone.validate(phoneStr)) {
			throw new Error('Invalid phone number');
		}
	}

	static validate(phone: string): boolean {
		return Phone.regex.test(phone);
	}

	public toString(): string {
		return this.phone;
	}
}
