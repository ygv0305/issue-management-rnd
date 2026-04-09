/**
 * @fileoverview User schema definition and related utilities.
 * Defines the structure of user documents in MongoDB, including authentication
 * fields, role management, and project associations. Includes automatic
 * password hashing via Mongoose pre-save middleware.
 * @module models/userSchema
 */

// Node modules
import { Schema, Types, model } from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Enum representing the available roles within the system.
 * @enum {string}
 */
export enum SystemRoles {
  Student = 'Student',
  Supervisor = 'Supervisor',
  PaperLeader = 'PaperLeader',
  Admin = 'Admin',
  Client = 'Client',
}

/**
 * Interface representing a user document in the database.
 * @interface
 */
export interface IUser {
  /** User's email address, used for login */
  email: string;
  /** Hashed password (auto-hashed on save) */
  password: string;
  /** User's role within the system */
  role: SystemRoles;
  /** User's full display name */
  fullName: string;
  /** Reference to the user's associated project (optional) */
  project?: Types.ObjectId;
}

/** Mongoose schema for User documents */
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

/** Mongoose model for User documents */
export default model<IUser>('User', userSchema);
