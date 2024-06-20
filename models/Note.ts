import mongoose from "mongoose";

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
  rootNode: string;
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
  rootNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Node",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
