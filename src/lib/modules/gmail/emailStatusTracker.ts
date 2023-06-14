import type { Gmailer } from "./gmail";
import client from "$db/client";
import { EmailStatusType } from "@prisma/client";
import { Email } from "../common/models/email";

export function emailSendLoggable() {
    return function (target: any, key: string, descriptor?: PropertyDescriptor) {
        if (!descriptor) {
            throw new Error("Decorator can only be applied to methods");
        }
        const sendMethod: typeof Gmailer.sendMessage = descriptor.value;
        descriptor.value = function (...args: Parameters<typeof sendMethod>) {
            const to = args[1];
            const subject = args[2];
            let email: string;
            if (to instanceof Email)
                email = to.address;
            else if (Array.isArray(to))
                email = to.map(t => t.address).join(", ");
            else
                throw new Error("Invalid email type");

            const statusEntry = client.emailStatus.create({
                data: {
                    to: email,
                    subject,
                    status: EmailStatusType.PENDING,
                    date: new Date()
                }
            });

            let newStatus = EmailStatusType.SENT as EmailStatusType;
            let msgId: string;

            try {
                const result = sendMethod.apply(this, args);
                if (result instanceof Promise) {
                    result.then(r => {
                        msgId = r.id;
                    });
                }
                return result;
            } catch (error) {
                newStatus = EmailStatusType.FAILED;
            }

            statusEntry.then(entry => {
                client.emailStatus.update({
                    where: { id: entry.id },
                    data: { status: newStatus, msgId }
                });
            });
        }
    }
}