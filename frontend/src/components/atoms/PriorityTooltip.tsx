// MUI
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// Icon
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Types
import type { PriorityJustifyType } from '../../utils/priorityJustifyData';

interface PriorityTooltipProps {
  data: PriorityJustifyType;
}

export default function PriorityTooltip({ data }: PriorityTooltipProps) {
  return (
    <Box>
      <Tooltip
        title={
          <Box sx={{ p: 1, maxWidth: 320 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: 500, lineHeight: 1.4 }}
            >
              {data.content}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.4, fontSize: '0.8rem' }}
              >
                <Box component="span" sx={{ fontWeight: 700 }}>
                  High:
                </Box>{' '}
                {data.high}
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.4, fontSize: '0.8rem' }}
              >
                <Box component="span" sx={{ fontWeight: 700 }}>
                  Medium:
                </Box>{' '}
                {data.medium}
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.4, fontSize: '0.8rem' }}
              >
                <Box component="span" sx={{ fontWeight: 700 }}>
                  Low:
                </Box>{' '}
                {data.low}
              </Typography>
            </Box>
          </Box>
        }
        arrow
        placement="top"
      >
        <IconButton size="small" sx={{ ml: 1 }} tabIndex={-1}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
