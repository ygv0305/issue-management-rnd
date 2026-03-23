// Types
import { Types } from 'mongoose';
import type { IUser } from '../../models/userSchema.js';
import type { SetupData } from '../../controllers/setup/setupController.js';

// Models
import User from '../../models/userSchema.js';
import Project from '../../models/projectSchema.js';

// Custom modules
import config from '../../config/env.js';

const getSetupUpdateData = async (data: SetupData) => {
  const { userId, fullName, role, projectId } = data;
  const updateData: any = {
    fullName,
    isSetupComplete: true,
  };

  if (role === 'Student' && projectId) {
    updateData.project = projectId;
  } else {
    updateData.role = role;
    if (role === 'Admin') {
      const user = await User.findById(userId).select('email');
      if (!user) throw new Error('User not found');
      if (user?.email === config.ADMIN_MAIL) {
        updateData.approvalStatus = 'Approved';
      } else {
        updateData.approvalStatus = 'Rejected';
      }
    } else {
      updateData.approvalStatus = 'Pending';
    }
  }

  return updateData;
};

export const setupProfile = async (data: SetupData): Promise<IUser | null> => {
  const { userId, projectId } = data;

  const updateData = await getSetupUpdateData(data);
  const user = await User.findByIdAndUpdate(userId, updateData, {
    returnDocument: 'after',
    runValidators: true,
  });

  // Update Project.members
  if (projectId) {
    await Project.findByIdAndUpdate(projectId, {
      $addToSet: { members: new Types.ObjectId(userId) },
    });
  }

  return user;
};
