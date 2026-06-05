// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface QuickStatCardProps {
  title: string;
  value: string | number;
  change?: number;
  suffix?: string;
  reverseColor?: boolean; // If true, "increase" is bad (red), "decrease" is good (green)
}

const QuickStatCard = ({
  title,
  value,
  change,
  suffix = '',
  reverseColor = false,
}: QuickStatCardProps) => {
  const isPositive = change !== undefined && change > 0;
  const isZero = change === 0;

  let labelColor = 'text.secondary';
  if (change !== undefined && !isZero) {
    if (reverseColor) {
      labelColor = isPositive ? 'error.main' : 'success.main';
    } else {
      labelColor = isPositive ? 'success.main' : 'error.main';
    }
  }

  return (
    <Card
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 3,
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ color: 'text.secondary', fontWeight: 600 }}
      >
        {title}
      </Typography>
      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {suffix && (
          <Typography variant="body2" color="text.secondary">
            {suffix}
          </Typography>
        )}
      </Box>
      {change !== undefined && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {!isZero && (
            <>
              {isPositive ? (
                <TrendingUpIcon sx={{ fontSize: 16, color: labelColor }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16, color: labelColor }} />
              )}
            </>
          )}
          <Typography
            variant="caption"
            sx={{ color: labelColor, fontWeight: 600 }}
          >
            {isPositive ? `+${change}%` : `${change}%`}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            from last week
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default QuickStatCard;
