import { Guid } from "guid-typescript";

export type Note = {
  messageId?: number;
  userId: Guid;
  username: string;
  locationName: string;
  notesText: string;
};
