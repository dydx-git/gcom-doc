import { type Company, type PurchaseOrder, EmailType } from "@prisma/client";
import { Gmailer } from "../gmail/gmail";
import type { JobSchema, JobWithVendorInfo, JobsWithVendorAndClient, OrderEmailBody } from "./meta";
import { Vendors } from "../vendor/vendor";
import { Email } from "../common/models/email";
import { Clients } from "../client/client";
import { Jobs } from "./order";

export class OrderMailer {
    public mailer: Promise<Gmailer>;

    constructor(company: Company) {
        this.mailer = Gmailer.getInstance(company);
    }

    public async sendToClient(order: Omit<PurchaseOrder, "id"> & OrderEmailBody & { preferredEmail: Email | null, client: { name: string }, primaryJobId: string }): Promise<boolean> {
        const gmail = await this.mailer;
        let clientEmail: Email | Email[] | null = order.preferredEmail;
        const job = await new Jobs().readById(order.primaryJobId);

        if (!job)
            throw new Error("Job not found");

        if (!clientEmail) {
            const emails = await new Clients().getEmails(order.clientId);

            if (!emails || emails.length == 0)
                throw new Error("Client has no emails");

            clientEmail = emails.filter(email => email.type == EmailType.JOB).map(email => new Email(email.email, order.client.name));
        }

        const isSent = await gmail.sendMessage(clientEmail, job.name, order.body, order.attachments);

        return isSent.status == 200;
    }


    public async sendToVendor(order: JobSchema & OrderEmailBody): Promise<boolean> {
        const gmail = await this.mailer;
        const vendor = await new Vendors().readById(order.vendorId);
        if (!vendor)
            return false;

        const vendorEmail = new Email(vendor.email);
        let subject = order.name;
        if (order.subjectAddendum)
            subject += ` - ${order.subjectAddendum}`;

        const isSent = await gmail.sendMessage(vendorEmail, subject, order.body, order.attachments);

        return isSent.status == 200;
    }
}