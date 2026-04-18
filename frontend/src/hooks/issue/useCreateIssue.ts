// Node modules
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import coreService from '../../services/coreService';
import searchService from '../../services/searchService';

// Hooks
import { useIssueTypes } from '../useSyncGlobalData';

// Types
import type { IssueTypeData } from '../../types/issueTypes';
import type { SearchedUserData } from '../../types/searchTypes';

// Lib
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

// MUI
import type { SelectChangeEvent } from '@mui/material/Select';

/** Shape of a react-select option for user tagging */
export type UserOption = {
  value: string;
  label: string;
  /** Raw email for custom rendering */
  email?: string;
};

interface UseCreateIssueReturn {
  issueTypes: IssueTypeData[];
  formData: CreateIssueFormData;
  submitting: boolean;
  loading: boolean;
  selectedUsers: UserOption[];
  loadOptionsRef: React.RefObject<ReturnType<typeof debounce> | null>;
  loadOptions: (
    inputValue: string,
    callback: (options: UserOption[]) => void,
  ) => void;
  handleUserChange: (selected: unknown) => void;
  AsyncSelectComponent: typeof AsyncSelect;
  setFormData: (data: CreateIssueFormData) => void;
  setSelectedUsers: (users: UserOption[]) => void;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => void;
  handleSubmit: (e: React.SubmitEvent) => Promise<void>;
}

interface CreateIssueFormData {
  issueType: string;
  subject: string;
  description: string;
  urgencyLevel: string;
  impactLevel: string;
}

/** Strips the '@autuni.ac.nz' suffix for display */
const trimEmail = (email: string) => email.replace(/@autuni\.ac\.nz$/i, '');

const INITIAL_FORM_DATA: CreateIssueFormData = {
  issueType: '',
  subject: '',
  description: '',
  urgencyLevel: '',
  impactLevel: '',
};

const resolvePriority = (urgency: string, impact: string): string => {
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

export const useCreateIssue = (): UseCreateIssueReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: issueTypes = [], isLoading: issueTypesLoading } =
    useIssueTypes();
  const [formData, setFormData] =
    useState<CreateIssueFormData>(INITIAL_FORM_DATA);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);

  // Debounced loadOptions ref, cancelled on unmount to prevent memory leaks
  const loadOptionsRef = useRef<ReturnType<typeof debounce> | null>(null);

  /**
   * Debounced function passed to AsyncSelect's loadOptions.
   * Queries the server and resolves with react-select options.
   * AsyncSelect internally tracks isLoading and handles race conditions.
   */
  const loadOptions = useCallback(
    (inputValue: string, callback: (options: UserOption[]) => void) => {
      if (!loadOptionsRef.current) {
        loadOptionsRef.current = debounce(
          async (query: string, cb: (options: UserOption[]) => void) => {
            if (!query || query.length < 2) {
              cb([]);
              return;
            }
            try {
              const response = await searchService.searchUsers(query);
              const options: UserOption[] = response.data.map(
                (user: SearchedUserData) => ({
                  value: user._id,
                  label: `${user.fullName} <${trimEmail(user.email)}>`,
                  email: trimEmail(user.email),
                }),
              );
              cb(options);
            } catch (error) {
              console.error('Error searching users, ', error);
              cb([]);
            }
          },
          300, // 300ms debounce to avoid excessive API calls
        );
      }

      loadOptionsRef.current(inputValue, callback);
    },
    [],
  );

  // Expose a wrapped onChange handler that handles the type casting
  const handleUserChange = useCallback((selected: unknown) => {
    setSelectedUsers(selected as UserOption[]);
  }, []);

  useEffect(() => {
    return () => {
      // Cancel debounce on unmount to prevent memory leaks
      loadOptionsRef.current?.cancel();
    };
  }, []);

  const createIssueMutation = useMutation({
    mutationFn: async () => {
      const priority = resolvePriority(
        formData.urgencyLevel,
        formData.impactLevel,
      );
      return await coreService.createIssue({
        subject: formData.subject,
        description: formData.description,
        type: formData.issueType,
        priority: priority,
        userTags: selectedUsers.map((u) => u.value),
      });
    },
    onSuccess: () => {
      alert('Issue submitted successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myIssues });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allIssues });
      navigate('/my-issues');
    },
    onError: (error) => {
      console.error('Failed to submit issue:', error);
      alert('Failed to submit issue. Please try again.');
    },
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!formData.urgencyLevel || !formData.impactLevel) {
      alert('Please select both Urgency Level and Impact Level.');
      return;
    }

    // Field validation
    if (formData.subject.length > 50) {
      alert('Subject cannot exceed 50 characters.');
      return;
    }
    if (formData.description.length > 1000) {
      alert('Description cannot exceed 1000 characters.');
      return;
    }

    createIssueMutation.mutate();
  };

  return {
    issueTypes,
    formData,
    submitting: createIssueMutation.isPending,
    loading: issueTypesLoading,
    selectedUsers,
    loadOptionsRef,
    loadOptions,
    handleUserChange,
    AsyncSelectComponent: AsyncSelect,
    setFormData,
    setSelectedUsers,
    handleChange,
    handleSubmit,
  };
};
