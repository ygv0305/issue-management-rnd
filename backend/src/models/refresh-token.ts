import { Schema, model, Types } from 'mongoose';

interface IRToken {
  token: string;
  userId: Types.ObjectId;
}

const tokenSchema = new Schema<IRToken>({
  token: {
    type: String,
    required: [true, 'Token is required'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
  },
});

export default model<IRToken>('RToken', tokenSchema);
