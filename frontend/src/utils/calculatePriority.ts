export const calculatePriority = (urgency: string, impact: string): string => {
  if (urgency === 'Low') {
    if (impact === 'Low' || impact === 'Medium') return 'Low';
    if (impact === 'High') return 'Medium';
  }
  if (urgency === 'Medium') {
    if (impact === 'Low') return 'Low';
    if (impact === 'Medium') return 'Medium';
    if (impact === 'High') return 'High';
  }
  if (urgency === 'High') {
    if (impact === 'Low') return 'Medium';
    if (impact === 'Medium') return 'High';
    if (impact === 'High') return 'Critical';
  }
  return '';
};
