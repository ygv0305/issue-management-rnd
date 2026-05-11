/**
 * @fileoverview Project schema definition.
 * Defines the structure of project documents, including the project name
 * and an array of member user references. The members array is denormalised
 * for efficient lookup of project participants.
 * @module models/projectSchema
 */

// Node modules
import { Schema, Types, model } from 'mongoose';

export interface IProject {
  name: string;
  // Array of user references for project members (denormalized for easy lookup)
  members: Types.ObjectId[];
}

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
    ],
  },
  { timestamps: true },
);

export default model<IProject>('Project', projectSchema);
