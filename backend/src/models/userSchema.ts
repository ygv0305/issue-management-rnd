// Node modules
import { Schema, Types, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  email: string;
  password: string;
  role: 'Student' | 'Supervisor' | 'PaperLeader' | 'Admin' | 'Client';
  fullName: string;
  project: Types.ObjectId;
  isSetupComplete: boolean;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected' | 'NotRequired';
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      maxLength: [50, 'Email must be less than 50 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      maxLength: [50, 'Password must be less than 50 characters'],
      minLength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
      type: String,
      enum: {
        values: [
          'Student',
          'Supervisor',
          'Moderator',
          'PaperLeader',
          'Admin',
          'Client',
        ],
        message: '{VALUE} role is not supported',
      },
      default: 'Student',
    },
    fullName: {
      type: String,
      maxLength: [50, 'Full name must be less than 50 characters'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    isSetupComplete: {
      type: Boolean,
      default: false,
    },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'NotRequired'],
      default: 'NotRequired', // Default for Students
    },
  },
  { timestamps: true },
);

// Password hashing
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export default model<IUser>('User', userSchema);
