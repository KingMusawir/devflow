import { model, models, Schema, Types } from 'mongoose';

export interface IAnswer {
  author: Types.ObjectId;
  questionId: Types.ObjectId;
  content: string;
  upvotes?: number;
  downvotes?: number;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Answer = models?.Answer || model<IAnswer>('Answer', AnswerSchema);

export default Answer;
