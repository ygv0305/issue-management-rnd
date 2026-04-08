/**
 * @fileoverview Project schema definition.
 * Defines the structure of project documents in MongoDB, including the project
 * name and an array of member user references. The members array is denormalized
 * for efficient lookup of project participants.
 * @module models/projectSchema
 */

// Node modules
import { Schema, Types, model } from 'mongoose';

/**
 * Interface representing a project document in the database.
 * @interface
 */
export interface IProject {
  /** Name of the project */
  name: string;
  /** Array of user references for project members (denormalized for easy lookup) */
  members: Types.ObjectId[];
}

/** Mongoose schema for Project documents */
const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      unique: [true, 'Project name must be unique'],
      maxLength: [50, 'Project name must be less than 50 characters'],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ], // Denormalised for easy lookup
  },
  { timestamps: true },
);

/** Mongoose model for Project documents */
export default model<IProject>('Project', projectSchema);
