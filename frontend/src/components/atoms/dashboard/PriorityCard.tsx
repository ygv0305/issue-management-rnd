// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Utils
import { calculatePriority } from '../../../utils/calculatePriority';

interface PriorityCardProps {
  urgency: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  count: number;
}

const PriorityCard = ({ urgency, impact, count }: PriorityCardProps) => {
  const theme = useTheme();
  const priority = calculatePriority(urgency, impact);

  const getPriorityStyles = (p: string) => {
    switch (p) {
      case 'Low':
        return {
          bgColor: theme.palette.info.light,
          borderColor: theme.palette.info.main,
          color: theme.palette.info.contrastText,
        };
      case 'Medium':
        return {
          bgColor: theme.palette.warning.light,
          borderColor: theme.palette.warning.main,
          color: theme.palette.warning.contrastText,
        };
      case 'High':
        return {
          bgColor: '#ba55d3',
          borderColor: '#9932cc',
          color: theme.palette.warning.contrastText,
        };
      case 'Critical':
        return {
          bgColor: theme.palette.error.light,
          borderColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
        };
      default:
        return {
          bgColor: theme.palette.grey[100],
          borderColor: theme.palette.grey[300],
          color: theme.palette.text.primary,
        };
    }
  };

  const styles = getPriorityStyles(priority);

  return (
    <Card
      variant="outlined"
      sx={{
        p: 1.5,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        borderRadius: 2,
        backgroundColor: styles.bgColor,
        borderColor: styles.borderColor,
        borderWidth: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {count}
      </Typography>
      <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 700 }}>
        {priority}
      </Typography>
    </Card>
  );
};

export default PriorityCard;
