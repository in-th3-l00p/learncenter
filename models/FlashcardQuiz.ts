import mongoose from "mongoose";
import { z } from "zod";

const flashcardQuizShape = {
  title: z.string(),
  description: z.string().optional(),
  flashcards: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  visibility: z.enum(["public", "private"]),
};

export const zNewFlashcardQuizSchema = z.object(flashcardQuizShape);

export const zFlashcardQuizSchema = z.object({
  _id: z.string(),
  createdAt: z.date().optional(),
  owner: z.string().optional(),
  ...flashcardQuizShape
});

export type NewFlashcardQuizType = z.infer<typeof zNewFlashcardQuizSchema>;
export type FlashcardQuizType = z.infer<typeof zFlashcardQuizSchema>;

const FlashcardQuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  flashcards: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  visibility: {
    type: String,
    enum: ["public", "private"],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FlashcardQuiz = mongoose.models.FlashcardQuiz || mongoose.model("FlashcardQuiz", FlashcardQuizSchema);

export default FlashcardQuiz;
