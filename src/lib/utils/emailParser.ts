import type { ISupportsAdditionalEmail } from '$lib/interfaces/core';
import { Email } from '$models/email';
import { StringToCollectionParser } from './stringToCollectionParser';

export abstract class EmailParser {
	static parse(emailStr: string): ISupportsAdditionalEmail {
		const emails = StringToCollectionParser.parse<string>(emailStr);

		const result: ISupportsAdditionalEmail = {
			emails: Array<Email>(),
			additionalEmail: Array<Email>()
		};
		emails.forEach((email) => {
			// regex to get a string between [ and ]
			const invoiceEmail = email.match(/\[(.*?)\]/);
			if (invoiceEmail) {
				result.additionalEmail.push(new Email(invoiceEmail[1]));
			} else if (email) {
				result.emails.push(new Email(email));
			}
		});

		return result;
	}
}
