import type { Company } from "@prisma/client";
import { Inbox } from "gmail-inbox";

export class Gmailer {
    private readonly BASE_PATH = "includes";
    private readonly GMAIL_CREDENTIALS_PATH = `${this.BASE_PATH}/gmail_credentials.json`;
    private static _instances: { [id: number]: Gmailer } = {} as any;
    private _company: Company;
    public inbox: Inbox;

    public static getInstance(company: Company) {
        const id = company.id;
        if (!this._instances[id])
            this._instances[id] = new Gmailer(company);

        return this._instances[id];
    }

    private constructor(private company: Company) {
        this._company = company;
        const id = company.id;
        this.inbox = new Inbox(this.GMAIL_CREDENTIALS_PATH, `${this.BASE_PATH}/${id}.json`);

        this.inbox.authenticateAccount();
    }
}