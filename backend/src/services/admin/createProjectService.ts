// Models
import Project from '../../models/projectSchema.js';

export const checkProjectExist = async (name: string) => {
  return await Project.findOne({ name }).lean().exec();
};

export const createProjectDb = async (name: string) => {
  return await Project.create({ name });
};
