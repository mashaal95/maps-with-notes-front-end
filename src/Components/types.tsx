import { Guid } from "guid-typescript";

export type Note = {
    messageId?: number;
    userId: Guid;
    locationName: string;
    notesText: string;
}