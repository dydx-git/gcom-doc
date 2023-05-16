import { EmailDirection, type Company } from "@prisma/client";
import { Gmailer } from "../gmail/gmail";
import type { JobWithVendorInfo, JobsWithVendorAndClient, OrderEmailBody } from "./meta";
import { Vendors } from "../vendor/vendor";
import { Email } from "../common/models/email";

export class OrderMailer {
    private instance: Promise<Gmailer>;

    get mailer() {
        return await this.instance;
    }

    constructor(company: Company) {
        this.instance = Gmailer.getInstance(company);
    }

    public async sendOrder(order: JobsWithVendorAndClient & OrderEmailBody, direction: EmailDirection): Promise<boolean> {
        const gmail = this.mailer;
        const to = direction == EmailDirection.FORWARD ? order. : order.client.email;
        const isSent = await gmail.sendMessage(order)
    }

    public async sendOrderToVendor(order: JobWithVendorInfo & OrderEmailBody): Promise<boolean> {
        const gmail = this.mailer;
        const vendor = await new Vendors().readById(order.vendorId);
        if (!vendor)
            return false;
        const vendorEmail = new Email(vendor.email);
        const isSent = await gmail.sendMessage(vendorEmail, order.name, order.body, order.attachments);

        return isSent.status == 200;
    }
}