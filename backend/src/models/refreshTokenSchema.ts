// Node modules
import { Schema, model, Types } from 'mongoose';

interface IRefreshToken {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  token: {
    type: String,
    required: [true, 'Token is required'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
});

export default model<IRefreshToken>('RefreshToken', refreshTokenSchema);
