import mongoose from "mongoose";
import { z } from "zod";

export const zQuizSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  questions: z.array(
    z.object({
      question: z.string(),
      description: z.string().optional(),
      options: z.array(
        z.object({
          option: z.string(),
          isCorrect: z.boolean(),
        }),
      ),
    }),
  ),
  visibility: z.enum(["public", "private"]),
  owner: z.string(),
  createdAt: z.date().optional(),
});

export type QuizType = z.infer<typeof zQuizSchema>;

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      options: [
        {
          option: {
            type: String,
            required: true,
          },
          isCorrect: {
            type: Boolean,
            required: true,
          },
        },
      ],
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

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);

export default Quiz;
