export enum EventType {
    USER_CREATED,
}

export interface Event {
    type: EventType;
    data: any;
}