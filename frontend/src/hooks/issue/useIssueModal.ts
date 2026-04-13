// Node modules
import { useState, useEffect, useRef } from 'react';

// Services
import coreService from '../../services/coreService';
import pLeaderService from '../../services/pLeaderService';

// Context
import { useUser } from '../../lib/context/UserContext';

// Types
import type {
  IssueData,
  CommentData,
  IssueStatus,
  IssuePriority,
} from '../../types/issueTypes';

type ActiveTab = 'details' | 'comments' | 'actions';

interface UseIssueModalReturn {
  commentMsg: string;
  isSubmitting: boolean;
  localThread: CommentData[];
  isLoadingComments: boolean;
  activeTab: ActiveTab;
  newStatus: IssueStatus | '';
  newPriority: IssuePriority | '';
  isUpdating: boolean;
  isChanged: boolean | null;
  isPaperLeader: boolean;
  statusOptions: IssueStatus[];
  priorityOptions: IssuePriority[];
  showTaggedUsers: boolean;
  taggedUsersRef: React.RefObject<HTMLDivElement | null>;
  setCommentMsg: (msg: string) => void;
  handleTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  setNewStatus: (status: IssueStatus) => void;
  setNewPriority: (priority: IssuePriority) => void;
  setShowTaggedUsers: React.Dispatch<React.SetStateAction<boolean>>;
  handlePostComment: (e: React.SubmitEvent) => Promise<void>;
  handleUpdateIssue: () => Promise<void>;
}

export const useIssueModal = (
  issue: IssueData | null,
  originAllIssue: boolean,
  open: boolean,
  onClose: () => void,
  onIssueUpdated?: (updatedIssue: IssueData) => void,
): UseIssueModalReturn => {
  const { user } = useUser();
  const [commentMsg, setCommentMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localThread, setLocalThread] = useState<CommentData[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');

  // Actions Tab State
  const [newStatus, setNewStatus] = useState<IssueStatus | ''>(
    issue?.status ?? '',
  );
  const [newPriority, setNewPriority] = useState<IssuePriority | ''>(
    issue?.priority ?? '',
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Tagged Users State
  const [showTaggedUsers, setShowTaggedUsers] = useState(false);
  const taggedUsersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!issue || !open) return;

    // Reset state when a new issue opens
    setActiveTab('details');
    setLocalThread([]);
    setIsLoadingComments(true);
    setNewStatus(issue.status);
    setNewPriority(issue.priority);

    const loadComments = async () => {
      try {
        const res = await coreService.fetchComments(issue._id);
        if (res.success) {
          setLocalThread(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch comments, ', error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [issue?._id, open]);

  const isChanged =
    issue && (newStatus !== issue.status || newPriority !== issue.priority);
  const isPaperLeader = user?.role === 'PaperLeader' && originAllIssue;

  const statusOptions: IssueStatus[] = [
    'New',
    'InProgress',
    'Resolved',
    'ReOpen',
    'Closed',
  ];
  const priorityOptions: IssuePriority[] = [
    'Low',
    'Medium',
    'High',
    'Critical',
  ];

  const handlePostComment = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!commentMsg.trim() || !issue) return;

    setIsSubmitting(true);
    try {
      const res = await coreService.createComment({
        issueId: issue._id,
        message: commentMsg,
      });

      if (res.success) {
        setLocalThread([...localThread, res.data]);
        setCommentMsg('');
      }
    } catch (error) {
      console.error('Failed to post comment, ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert MUI Tabs event signature to call setActiveTab
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as ActiveTab);
  };

  const handleUpdateIssue = async () => {
    if (!isChanged || !issue) return;
    setIsUpdating(true);

    try {
      let updatedIssue = issue;

      const res = await pLeaderService.changeStatus({
        issueId: issue._id,
        ...(newStatus !== issue.status && newStatus !== '' && { newStatus }),
        ...(newPriority !== issue.priority &&
          newPriority !== '' && { newPriority }),
      });
      if (res.success) updatedIssue = res.data;

      if (onIssueUpdated) {
        onIssueUpdated(updatedIssue);
      }
      onClose();
    } catch (error) {
      console.error('Failed to update issue, ', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    commentMsg,
    isSubmitting,
    localThread,
    isLoadingComments,
    activeTab,
    newStatus,
    newPriority,
    isUpdating,
    isChanged,
    isPaperLeader,
    statusOptions,
    priorityOptions,
    showTaggedUsers,
    taggedUsersRef,
    setCommentMsg,
    handleTabChange,
    setNewStatus,
    setNewPriority,
    setShowTaggedUsers,
    handlePostComment,
    handleUpdateIssue,
  };
};
