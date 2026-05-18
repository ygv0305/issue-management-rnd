/**
 * @fileoverview User schema definition and related utilities.
 * Defines the structure of user documents, including authentication
 * fields, role management, and project associations. Includes automatic
 * password hashing via Mongoose pre-save middleware.
 * @module models/userSchema
 */

// Node modules
import { Schema, Types, model } from 'mongoose';
import bcrypt from 'bcrypt';

export enum SystemRoles {
  Student = 'Student',
  Supervisor = 'Supervisor',
  Moderator = 'Moderator',
  PaperLeader = 'PaperLeader',
  Admin = 'Admin',
  Client = 'Client',
}

export interface IUser {
  email: string;
  password: string;
  role: SystemRoles;
  fullName: string;
  // Reference to the user's associated project (Student role only)
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

userSchema.index({ fullName: 'text', email: 'text' });
userSchema.index({ project: 1 });

/**
 * Pre-save middleware that automatically hashes the password before
 * storing it in the database. Only runs when the password field is modified.
 * @param {Function} next - Mongoose next middleware callback
 */
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export default model<IUser>('User', userSchema);
