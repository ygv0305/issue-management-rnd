// MUI
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface IssueModalTabsProps {
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  commentCount: number;
  showActionsTab: boolean;
}

export default function IssueModalTabs({
  activeTab,
  onTabChange,
  commentCount,
  showActionsTab,
}: IssueModalTabsProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
      <Tabs value={activeTab} onChange={onTabChange}>
        <Tab label="Overview" value="details" />
        <Tab
          label={
            <span>Discussion {commentCount > 0 && `(${commentCount})`}</span>
          }
          value="comments"
        />
        {showActionsTab && <Tab label="Actions" value="actions" />}
      </Tabs>
    </Box>
  );
}
