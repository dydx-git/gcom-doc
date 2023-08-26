import type { InlineNotificationProps } from "carbon-components-svelte/types/Notification/InlineNotification.svelte";
import { writable } from "svelte/store";

export enum FormSubmitType {
    AddNew,
    Edit
}
export type Notification = {
    type: InlineNotificationProps["kind"];
    title: string;
    message?: string | null;
}
export const notificationStore = writable<Notification | null>(null);