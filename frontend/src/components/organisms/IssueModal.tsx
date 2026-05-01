// Node modules
import React from 'react';

// MUI
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Hooks
import { useIssueModal } from '../../hooks/issue/useIssueModal';

// Types
import type { IssueData } from '../../types/issueTypes';

// Components
import IssueModalHeader from '../molecules/issue-modal/IssueModalHeader';
import IssueModalTabs from '../molecules/issue-modal/IssueModalTabs';
import OverviewTab from '../molecules/issue-modal/OverviewTab';
import CommentList from '../molecules/issue-modal/CommentList';
import CommentInput from '../atoms/issue-modal/CommentInput';
import ActionsPanel from '../molecules/issue-modal/ActionsPanel';
import Typography from '@mui/material/Typography';

interface IssueModalProps {
  issue: IssueData | null;
  originAllIssue: boolean;
  open: boolean;
  onClose: () => void;
  onIssueUpdated?: (updatedIssue: IssueData) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

export default function IssueModal({
  issue,
  originAllIssue,
  open,
  onClose,
  onIssueUpdated,
}: IssueModalProps) {
  const {
    commentMsg,
    isSubmitting,
    localThread,
    isLoadingComments,
    activeTab,
    newStatus,
    newUrgency,
    newImpact,
    isUpdating,
    isChanged,
    isPaperLeader,
    statusOptions,
    priorityOptions,
    setCommentMsg,
    handleTabChange,
    setNewStatus,
    setNewUrgency,
    setNewImpact,
    handlePostComment,
    handleUpdateIssue,
  } = useIssueModal(issue, originAllIssue, open, onClose, onIssueUpdated);

  if (!issue) return null;

  const allowCommentInput = ['Resolved', 'Closed'];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: 2, minHeight: '600px' } }}
    >
      <IssueModalHeader issueId={issue._id} onClose={onClose} />

      <IssueModalTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        commentCount={localThread.length}
        showActionsTab={isPaperLeader}
      />

      <DialogContent
        sx={{
          p: 3,
          pt: 0,
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.300',
            borderRadius: '4px',
          },
        }}
      >
        <TabPanel value={activeTab} index="details">
          <OverviewTab issue={issue} />
        </TabPanel>

        <TabPanel value={activeTab} index="comments">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '450px',
            }}
          >
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <CommentList
                comments={localThread}
                isLoading={isLoadingComments}
              />
            </Box>

            {!allowCommentInput.includes(issue.status) ? (
              <CommentInput
                value={commentMsg}
                onChange={setCommentMsg}
                onSubmit={handlePostComment}
                isSubmitting={isSubmitting}
              />
            ) : (
              <Box
                sx={{
                  bgcolor: 'background.default',
                  mb: 2,
                  p: 2,
                  textAlign: 'center',
                }}
              >
                <Typography>
                  {`This issue is already ${issue.status}.`}
                </Typography>
                {issue.status === 'Resolved' && (
                  <>
                    <Typography>
                      Consider re-opening it to post new comments.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleUpdateIssue(true)}
                    >
                      Re-Open
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index="actions">
          {isPaperLeader && (
            <ActionsPanel
              newStatus={newStatus}
              newUrgency={newUrgency}
              newImpact={newImpact}
              statusOptions={statusOptions}
              priorityOptions={priorityOptions}
              isChanged={isChanged}
              isUpdating={isUpdating}
              onStatusChange={setNewStatus}
              onUrgencyChange={setNewUrgency}
              onImpactChange={setNewImpact}
              onConfirm={() => handleUpdateIssue(false)}
            />
          )}
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
