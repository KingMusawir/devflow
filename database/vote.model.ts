import { model, models, Schema, Types } from 'mongoose';

export interface IVote {
  author: Types.ObjectId;
  postId: Types.ObjectId;
  type: string;
  voteType: number;
}
const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ['question', 'answer'], required: true },
    voteType: { type: Number, enum: ['upvotes', 'downvotes'], required: true },
  },
  { timestamps: true },
);

const Vote = models.Vote || model<IVote>('Vote', VoteSchema);

export default Vote;
