// Types
import { Types } from 'mongoose';
import type { IUser } from '../../models/userSchema.js';

// Models
import User from '../../models/userSchema.js';
import Project from '../../models/projectSchema.js';

export interface SetupData {
  userId: Types.ObjectId;
  fullName: string;
  role: 'Student' | 'Supervisor' | 'PaperLeader' | 'Admin' | 'Client';
  projectIds?: string[];
}

export const projectRules = (data: Pick<SetupData, 'role' | 'projectIds'>) => {
  const { role, projectIds } = data;

  if (role === 'Student' && (!projectIds || projectIds.length !== 1)) {
    return 'Student must select exactly one project';
  }

  if (
    ['Supervisor', 'Client'].includes(role) &&
    (!projectIds || projectIds.length === 0 || projectIds.length > 5)
  ) {
    return 'Supervisor/Client must select between 1 and 5 projects';
  }

  return '';
};

const handleProjectAssignments = (
  data: Pick<SetupData, 'role' | 'projectIds'>,
) => {
  const { role, projectIds } = data;

  let validProjectIds: Types.ObjectId[] = [];
  if (projectIds && projectIds.length > 0) {
    if (role === 'Student') {
      validProjectIds = [new Types.ObjectId(projectIds[0])];
    } else if (['Supervisor', 'Client'].includes(role)) {
      validProjectIds = projectIds
        .slice(0, 5)
        .map((id) => new Types.ObjectId(id));
    }
    return validProjectIds;
  }
  return null;
};

export const setupProfile = async (data: SetupData): Promise<IUser | null> => {
  const { userId, fullName, role } = data;

  const updateData: any = {
    fullName,
    isSetupComplete: true,
  };

  if (role !== 'Student') {
    updateData.role = role;
    updateData.approvalStatus = 'Pending';
  } else {
    updateData.role = 'Student';
    updateData.approvalStatus = 'NotRequired';
  }

  // Handle project assignments
  const validProjectIds = handleProjectAssignments(data);
  if (validProjectIds) {
    updateData.project = validProjectIds;
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!user) throw new Error('User not found');

  // Update Project.members
  if (validProjectIds!.length > 0) {
    await Project.updateMany(
      { _id: { $in: validProjectIds } },
      { $addToSet: { members: new Types.ObjectId(userId) } },
    );
  }

  return user;
};
