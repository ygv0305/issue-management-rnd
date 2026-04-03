// Types
import type { IssuePriority } from '../types/issueTypes';

const getPriorityColor = (priority: IssuePriority) => {
  switch (priority) {
    case 'Critical':
      return '#ff3707';
    case 'High':
      return '#ffa716';
    case 'Medium':
      return '#4169e1';
    case 'Low':
      return '#808080';
    default:
      return '#808080';
  }
};

export default getPriorityColor;
