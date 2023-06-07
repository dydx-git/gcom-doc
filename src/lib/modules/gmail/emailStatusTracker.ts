import type { Gmailer } from "./gmail";
import client from "$db/client";

export function Loggable() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const sendMethod: typeof Gmailer.sendMessage = descriptor.value;
        descriptor.value = function (...args: Parameters<typeof sendMethod>) {

            const result = sendMethod.apply(this, args);
            log.debug({ result }, "Method called");
            return result;
        }
    }
}