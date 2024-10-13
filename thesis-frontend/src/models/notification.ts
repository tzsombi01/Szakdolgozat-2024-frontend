import { Entity } from "./entity";

export interface Notification extends Entity {
    target: string;
    notificationType: NotificationType;
    path: string;
    name: string;
    message: string;
    seen: boolean;
}

export interface NotificationInput {
    target: string;
    notificationType: NotificationType;
    path: string;
    name: string;
    message: string;
    seen: boolean;
}

export enum NotificationType {
    ACCEPT = 'ACCEPT',
    SEEN = 'SEEN'
}
