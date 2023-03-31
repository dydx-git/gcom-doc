import type { Company } from "@prisma/client";
import { GmailAuth } from "./oauth";

export class Gmailer {
    private static _instances: { [id: number]: Gmailer } = {} as any;
    private _company: Company;

    public static getInstance(company: Company) {
        const id = company.id;
        if (!this._instances[id])
            this._instances[id] = new Gmailer(company);

        return this._instances[id];
    }

    private constructor(company: Company) {
        this._company = company;
        const id = company.id;
        const gmailAuth = new GmailAuth(id);
        const authenticated = async () => await gmailAuth.authorize();
        if (!authenticated())
            throw new Error("Gmail account not authenticated");
    }
}