// Node modules
import { Schema, Types, model } from 'mongoose';

export interface IProject {
  name: string;
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
    ], // Denormalised for easy lookup
  },
  { timestamps: true },
);

export default model<IProject>('Project', projectSchema);
