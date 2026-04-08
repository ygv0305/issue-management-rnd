// Node modules
import { Schema, Types, model } from 'mongoose';
import bcrypt from 'bcrypt';

export enum SystemRoles {
  Student = 'Student',
  Supervisor = 'Supervisor',
  PaperLeader = 'PaperLeader',
  Admin = 'Admin',
  Client = 'Client',
}

export interface IUser {
  email: string;
  password: string;
  role: SystemRoles;
  fullName: string;
  project?: Types.ObjectId;
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
      select: false,
      maxLength: [50, 'Password must be less than 50 characters'],
    },
    role: {
      type: String,
      enum: Object.values(SystemRoles),
      default: SystemRoles.Student,
    },
    fullName: {
      type: String,
      maxLength: [50, 'Full name must be less than 50 characters'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
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
