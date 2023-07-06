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
                let entryId: number;
                statusEntry.then(entry => {
                    entryId = entry.id;
                });
                if (!(result instanceof Promise))
                    throw new Error("Invalid return type");

                result.then(r => {
                    msgId = r.id;
                    client.emailStatus.update({
                        where: { id: entryId },
                        data: { status: newStatus, msgId }
                    }).then(() => {
                        console.log("Email sent successfully");
                    });
                }).catch(err => {
                    const error = err as Error;
                    newStatus = EmailStatusType.FAILED;
                    client.emailStatus.update({
                        where: { id: entryId },
                        data: { status: newStatus, error: error.message }
                    }).then(() => {
                        console.log("Email failed to send");
                    });
                });

                return result;
            } catch (error) {
                newStatus = EmailStatusType.FAILED;
            }
        }
    }
}