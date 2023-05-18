import validator from "validator";

export class Email {
	public readonly address: string;
	public name: string;

	constructor(emailStr: string, name: string = "Unknown") {
		this.address = emailStr;
		this.name = name;
		if (!validator.isEmail(this.address)) {
			throw new Error('Invalid email address');
		}
	}
}
