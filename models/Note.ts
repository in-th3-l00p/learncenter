import mongoose from "mongoose";
import { z } from "zod";

const noteShape = {
  title: z.string(),
  content: z.string(),
  users: z.array(
    z.object({
      userId: z.string(),
      role: z.enum(["reader", "editor", "owner"]),
    }),
  )
};

export const zNewNoteSchema = z.object(noteShape);

export const NewNoteType = z.infer<typeof zNewNoteSchema>;

export const zNoteSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  ...noteShape,
});

export type NoteType = z.infer<typeof zNoteSchema>;

// fix objectid vs string
export interface INote {
  _id: string;
  title: string;
  content: string;
  users: [
    {
      userId: string;
      role: string;
    },
  ];
  createdAt: Date;
}

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  users: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["reader", "editor", "owner"],
        default: "owner",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
