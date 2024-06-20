import mongoose from "mongoose";

export interface IQuiz {
  title: string;
  description?: string;
  questions: {
    question: string;
    options: {
      option: string;
      isCorrect: boolean;
    }[];
  }[];
  owner: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

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
