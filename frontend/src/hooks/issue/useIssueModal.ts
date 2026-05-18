// Node modules
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

// Services
import coreService from '../../services/coreService';
import pLeaderService from '../../services/pLeaderService';

// Lib
import { useUser } from '../../lib/context/UserContext';
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';
import { getCommentSocket } from '../../lib/socket';

// Types
import type {
  IssueData,
  CommentData,
  IssueStatus,
  IssueUrgencyAndImpact,
  FetchCommentsResponse,
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
  fetchNextComments: () => void;
  hasNextComments: boolean;
  isFetchingNextComments: boolean;
}

export const useIssueModal = (
  issue: IssueData | null,
  originAllIssue: boolean,
  open: boolean,
  onIssueUpdated?: (updatedIssue: IssueData) => void,
): UseIssueModalReturn => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [commentMsg, setCommentMsg] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');

  // Actions tab states
  const [newStatus, setNewStatus] = useState<IssueStatus | ''>(
    issue?.status ?? '',
  );
  const [newUrgency, setNewUrgency] = useState<IssueUrgencyAndImpact | ''>(
    issue?.urgency ?? '',
  );
  const [newImpact, setNewImpact] = useState<IssueUrgencyAndImpact | ''>(
    issue?.impact ?? '',
  );

  // Tagged users states
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

  // Fetch comments with infinite query (for infinite scrolling)
  const {
    data: commentData,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
    isFetchingNextPage: isFetchingNextComments,
    isLoading: isLoadingComments,
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.comments(issue?._id ?? ''),
    queryFn: async ({ pageParam = 1 }) => {
      if (!issue)
        return {
          data: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            limit: 10,
          },
        };
      const res = await coreService.fetchComments(
        issue._id,
        pageParam as number,
        10,
      );
      return res;
    },
    getNextPageParam: (lastPage) => {
      // Backend returns newest first, so page 2 contains older comments
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? (currentPage as number) + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!issue && open && activeTab === 'comments',
  });

  const localThread = useMemo(() => {
    // Flatten paginated results
    const allComments = commentData?.pages.flatMap((page) => page.data) || [];
    // The backend returns newest first for efficient pagination (skip/limit).
    // However to display in a chat-like interface, we need oldest first (bottom of list).
    return [...allComments].reverse();
  }, [commentData]);

  // Real-time and fetch comments logic
  useEffect(() => {
    if (!issue || !open || activeTab !== 'comments') return;

    const issueId = issue._id;
    const socket = getCommentSocket();
    socket.emit('joinIssue', issueId);

    const handleNewComment = (newComment: CommentData) => {
      queryClient.setQueryData<InfiniteData<FetchCommentsResponse>>(
        QUERY_KEYS.comments(issueId),
        (prev) => {
          if (!prev) return prev;

          // Add new comment to the first page (newest)
          const updatedPages = [...prev.pages];
          const firstPage = { ...updatedPages[0] };

          if (firstPage.data.some((c) => c._id === newComment._id)) return prev;

          firstPage.data = [newComment, ...firstPage.data];
          updatedPages[0] = firstPage;
          return { ...prev, pages: updatedPages };
        },
      );
    };

    socket.on('newComment', handleNewComment);

    return () => {
      socket.emit('leaveIssue', issueId);
      socket.off('newComment', handleNewComment);
    };
  }, [issue, open, activeTab, queryClient]);

  // Post comment mutation
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
        queryClient.setQueryData<InfiniteData<FetchCommentsResponse>>(
          QUERY_KEYS.comments(issue?._id ?? ''),
          (prev) => {
            if (!prev) return prev;

            const updatedPages = [...prev.pages];
            const firstPage = { ...updatedPages[0] };

            if (firstPage.data.some((c) => c._id === res.data._id)) return prev;

            firstPage.data = [res.data, ...firstPage.data];
            updatedPages[0] = firstPage;
            return { ...prev, pages: updatedPages };
          },
        );
        setCommentMsg('');
      }
    },
  });

  // Update issue mutation
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
      }
    },
  });

  // Check if actions tab states are changed (used to disable 'Confirm/Submit' button if unchanged)
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
    // Refetch comments every time we navigate to 'Discussion' tab
    if (newValue === 'comments' && issue) {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.comments(issue._id),
      });
    }
  };

  // isReopen: Check if it is triggered by "ReOpen" from Discussion tab
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
    fetchNextComments,
    hasNextComments,
    isFetchingNextComments,
  };
};
