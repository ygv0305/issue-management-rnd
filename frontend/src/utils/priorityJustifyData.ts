export interface PriorityJustifyType {
  content: string;
  high: string;
  medium: string;
  low: string;
}

export const urgencyData: PriorityJustifyType = {
  content:
    'How quickly the issue must be resolved, based on your project progress or academic deadlines.',
  high: 'Critical blocker, needs immediate attention.',
  medium: 'Important but not an emergency, generally resolved within a week.',
  low: 'Low or no pressing deadline or time constraints.',
};

export const impactData: PriorityJustifyType = {
  content:
    'How many students or personnel are affected, and how severely it disrupts your project operations.',
  high: 'Need to discuss with team on what to write here.',
  medium:
    'Limited to a group of students or personnel, but still causes significant delay or frustration.',
  low: 'Affects only a few individuals or a low-impact blockage, with negligible effect.',
};
