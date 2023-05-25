import React from "react";
import { Box } from "@mui/material";
import NoteCard from "./noteCard";
import { Note } from "./types";

const NotesList = (props: { notes: Note[] }) => {
  return (
    <Box sx={{ p: 2 }} width={"80%"}>
      {props.notes.map((note: Note) => (
        <NoteCard key={note.messageId} note={note} />
      ))}
    </Box>
  );
};

export default NotesList;
