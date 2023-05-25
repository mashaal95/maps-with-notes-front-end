import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  CardHeader
} from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Note } from "./types";

const NoteCard = (props: { note: Note }) => {
  return (
    <Card key={props.note.messageId} style={{ marginBottom: "1rem" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            U
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.note.username}
        subheader={props.note.locationName.split(" ").slice(0, 3).join(" ")}
      />
      <CardContent>
        <Typography>{props.note.notesText}</Typography>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
