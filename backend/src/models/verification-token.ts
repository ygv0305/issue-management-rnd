// Node modules
import { Schema, model } from 'mongoose';

export interface IVerificationToken {
  email: string;
  token: string;
  type: 'Register' | 'Reset';
  expiresAt: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Register', 'Reset'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // TTL index: document expires at the exact time of `expiresAt`
    },
  },
  { timestamps: true }
);

export default model<IVerificationToken>('VerificationToken', verificationTokenSchema);
