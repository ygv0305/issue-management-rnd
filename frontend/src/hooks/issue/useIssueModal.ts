// Node modules
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import coreService from '../../services/coreService';
import pLeaderService from '../../services/pLeaderService';

// Lib
import { useUser } from '../../lib/context/UserContext';
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

// Types
import type {
  IssueData,
  CommentData,
  IssueStatus,
  IssueUrgencyAndImpact,
} from '../../types/issueTypes';

type ActiveTab = 'details' | 'comments' | 'actions';

interface UseIssueModalReturn {
  commentMsg: string;
  isSubmitting: boolean;
  localThread: CommentData[];
  isLoadingComments: boolean;
  activeTab: ActiveTab;
  newStatus: IssueStatus | '';
  newUrgency: IssueUrgencyAndImpact | '';
  newImpact: IssueUrgencyAndImpact | '';
  isUpdating: boolean;
  isChanged: boolean;
  isPaperLeader: boolean;
  isAssignedTo?: string;
  isAssignedToMe: boolean;
  isAssigning: boolean;
  statusOptions: IssueStatus[];
  priorityOptions: IssueUrgencyAndImpact[];
  showTaggedUsers: boolean;
  taggedUsersRef: React.RefObject<HTMLDivElement | null>;
  setCommentMsg: (msg: string) => void;
  handleTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  setNewStatus: (status: IssueStatus) => void;
  setNewUrgency: (urgency: IssueUrgencyAndImpact) => void;
  setNewImpact: (impact: IssueUrgencyAndImpact) => void;
  setShowTaggedUsers: React.Dispatch<React.SetStateAction<boolean>>;
  handlePostComment: (e: React.SubmitEvent) => Promise<void>;
  handleUpdateIssue: (isReopen: boolean) => Promise<void>;
  handleAssignToMe: () => void;
}

export const useIssueModal = (
  issue: IssueData | null,
  originAllIssue: boolean,
  open: boolean,
  onClose: () => void,
  onIssueUpdated?: (updatedIssue: IssueData) => void,
): UseIssueModalReturn => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [commentMsg, setCommentMsg] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');

  // Actions Tab State
  const [newStatus, setNewStatus] = useState<IssueStatus | ''>(
    issue?.status ?? '',
  );
  const [newUrgency, setNewUrgency] = useState<IssueUrgencyAndImpact | ''>(
    issue?.urgency ?? '',
  );
  const [newImpact, setNewImpact] = useState<IssueUrgencyAndImpact | ''>(
    issue?.impact ?? '',
  );

  // Tagged Users State
  const [showTaggedUsers, setShowTaggedUsers] = useState(false);
  const taggedUsersRef = useRef<HTMLDivElement>(null);

  const [prevIssueId, setPrevIssueId] = useState<string | undefined>(
    issue?._id,
  );
  const [prevOpen, setPrevOpen] = useState<boolean>(open);

  // Reset state when a new issue opens
  if (issue?._id !== prevIssueId || open !== prevOpen) {
    setPrevIssueId(issue?._id);
    setPrevOpen(open);
    if (issue && open) {
      setActiveTab('details');
      setNewStatus(issue.status);
      setNewUrgency(issue.urgency);
      setNewImpact(issue.impact);
      setCommentMsg('');
    }
  }

  // Fetch comments
  const { data: localThread = [], isLoading: isLoadingComments } = useQuery({
    queryKey: QUERY_KEYS.comments(issue?._id ?? ''),
    queryFn: async () => {
      if (!issue) return [];
      const res = await coreService.fetchComments(issue._id);
      return res.success ? res.data : [];
    },
    enabled: !!issue && open,
  });

  // Post Comment Mutation
  const postCommentMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!issue) return;
      return await coreService.createComment({
        issueId: issue._id,
        message,
      });
    },
    onSuccess: (res) => {
      if (res?.success) {
        queryClient.setQueryData(
          QUERY_KEYS.comments(issue?._id ?? ''),
          (old: CommentData[] = []) => [...old, res.data],
        );
        setCommentMsg('');
      }
    },
  });

  // Update Issue Mutation
  const updateIssueMutation = useMutation({
    mutationFn: async (isReopen: boolean) => {
      if (!issue) return;
      if (isReopen) {
        return await coreService.reOpenIssue({
          issueId: issue._id,
          newStatus: 'ReOpen',
        });
      } else {
        return await pLeaderService.changeStatus({
          issueId: issue._id,
          ...(newStatus !== issue.status && newStatus !== '' && { newStatus }),
          ...(newUrgency !== issue.urgency &&
            newUrgency !== '' && { newUrgency }),
          ...(newImpact !== issue.impact && newImpact !== '' && { newImpact }),
        });
      }
    },
    onSuccess: (res) => {
      if (res?.success) {
        if (onIssueUpdated) {
          onIssueUpdated(res.data);
        }
        onClose();
      }
    },
  });

  const isChanged =
    !!issue &&
    (newStatus !== issue.status ||
      newUrgency !== issue.urgency ||
      newImpact !== issue.impact);
  const isPaperLeader = user?.role === 'PaperLeader' && originAllIssue;
  const isAssignedTo = issue?.assignedTo?.fullName;
  const isAssignedToMe = issue?.assignedTo?._id === user?._id;

  const statusOptions: IssueStatus[] = [
    'New',
    'InProgress',
    'Resolved',
    'ReOpen',
    'Closed',
  ];
  const priorityOptions: IssueUrgencyAndImpact[] = ['Low', 'Medium', 'High'];

  const handlePostComment = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!commentMsg.trim() || !issue) return;
    postCommentMutation.mutate(commentMsg);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as ActiveTab);
  };

  const handleUpdateIssue = async (isReopen: boolean) => {
    if (!issue) return;
    if (!isReopen) {
      if (!isChanged) return;
      if (newStatus === 'New') {
        alert('You can not change an issue status back to "New".');
        return;
      }
    }
    updateIssueMutation.mutate(isReopen);
  };

  const assignIssueMutation = useMutation({
    mutationFn: async () => {
      if (!issue) return;
      return await pLeaderService.assignToMe({
        issueId: issue._id,
        isUnassign: isAssignedToMe,
      });
    },
    onSuccess: (res) => {
      if (res?.success) {
        if (onIssueUpdated) {
          onIssueUpdated(res.data);
        }
        onClose();
      }
    },
  });

  const handleAssignToMe = () => {
    if (!issue) return;
    assignIssueMutation.mutate();
  };

  return {
    commentMsg,
    isSubmitting: postCommentMutation.isPending,
    localThread,
    isLoadingComments,
    activeTab,
    newStatus,
    newUrgency,
    newImpact,
    isUpdating: updateIssueMutation.isPending,
    isChanged,
    isPaperLeader,
    isAssignedTo,
    isAssignedToMe,
    isAssigning: assignIssueMutation.isPending,
    statusOptions,
    priorityOptions,
    showTaggedUsers,
    taggedUsersRef,
    setCommentMsg,
    handleTabChange,
    setNewStatus,
    setNewUrgency,
    setNewImpact,
    setShowTaggedUsers,
    handlePostComment,
    handleUpdateIssue,
    handleAssignToMe,
  };
};
