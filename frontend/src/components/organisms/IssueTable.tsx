// Node modules
import React, { useMemo } from 'react';

// Types
import type {
  IssueData,
  IssueStatus,
  IssuePriority,
} from '../../types/issueTypes';

// Components
import StatusBadge from '../atoms/StatusBadge';

// Hooks
import { useIssueTypes } from '../../hooks/useProjectsAndTypes';

// Utils
import { calculatePriority } from '../../utils/calculatePriority';

// MUI
import { DataGrid } from '@mui/x-data-grid';
import type {
  GridColDef,
  GridRenderCellParams,
  GridPaginationModel,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';

interface IssueTableProps {
  originAllIssue: boolean;
  issues: IssueData[];
  onIssueSelect: (issue: IssueData) => void;
  totalCount?: number;
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  isLoading?: boolean;
}

const IssueStatusArr: IssueStatus[] = [
  'New',
  'InProgress',
  'Resolved',
  'ReOpen',
  'Closed',
];

const IssuePrioArr: IssuePriority[] = ['Low', 'Medium', 'High', 'Critical'];

const IssueTableInner = ({
  originAllIssue,
  issues,
  onIssueSelect,
  totalCount = 0,
  paginationModel,
  onPaginationModelChange,
  isLoading = false,
}: IssueTableProps) => {
  const { data: issueTypes = [] } = useIssueTypes();
  const IssueTypeArr = useMemo(
    () => issueTypes.map((t) => t.name),
    [issueTypes],
  );

  const rows = useMemo(
    () =>
      issues.map((issue) => ({
        ...issue,
        priority: calculatePriority(issue.urgency, issue.impact),
      })),
    [issues],
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: '_id',
        filterable: false,
        headerName: 'ID',
        headerClassName: 'issue-table-header',
        width: 110,
        valueFormatter: (value?: string) => {
          if (value) {
            return `#${value.slice(-6).toUpperCase()}`;
          }
        },
      },
      {
        field: 'subject',
        headerName: 'Subject',
        headerClassName: 'issue-table-header',
        flex: 1,
        minWidth: 250,
      },
      {
        field: 'type',
        headerName: 'Type',
        headerClassName: 'issue-table-header',
        width: 220,
        valueGetter: (_value, row) => row.type?.name || 'N/A',
        type: 'singleSelect',
        valueOptions: IssueTypeArr,
      },
      {
        field: 'createdAt',
        headerName: 'Date',
        headerClassName: 'issue-table-header',
        width: 110,
        valueFormatter: (value?: string) => {
          if (value) {
            return new Date(value).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
            });
          }
        },
        type: 'date',
      },
      {
        field: 'status',
        headerName: 'Status',
        headerClassName: 'issue-table-header',
        width: 110,
        renderCell: (params: GridRenderCellParams) => (
          <StatusBadge status={params.value} />
        ),
        type: 'singleSelect',
        valueOptions: IssueStatusArr,
        sortComparator: (v1: string, v2: string) =>
          IssueStatusArr.indexOf(v1 as IssueStatus) -
          IssueStatusArr.indexOf(v2 as IssueStatus),
      },
      {
        field: 'priority',
        headerName: 'Priority',
        headerClassName: 'issue-table-header',
        width: 110,
        renderCell: (params: GridRenderCellParams) => (
          <StatusBadge priority={params.value} />
        ),
        type: 'singleSelect',
        valueOptions: IssuePrioArr,
        sortComparator: (v1: string, v2: string) =>
          IssuePrioArr.indexOf(v1 as IssuePriority) -
          IssuePrioArr.indexOf(v2 as IssuePriority),
      },
      ...(originAllIssue
        ? [
            {
              field: 'assignedTo',
              headerName: 'Assigned To',
              headerClassName: 'issue-table-header',
              valueGetter: (_value, row) => row.assignedTo?.fullName || '',
              width: 180,
            } as GridColDef,
          ]
        : []),
    ],
    [IssueTypeArr, originAllIssue],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          maxHeight: '84vh',
          width: '100%',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
          overflowY: 'auto',
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          onRowClick={(params) => onIssueSelect(params.row as IssueData)}
          showToolbar
          // Server-side pagination config
          paginationMode="server"
          rowCount={totalCount} // Tells DataGrid how many total rows exist on the server
          paginationModel={paginationModel} // Current page and pageSize
          onPaginationModelChange={onPaginationModelChange} // Callback when page or pageSize changes
          loading={isLoading} // Show loading overlay when fetching
          // ------------------------------
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            },
            '& .issue-table-header': {
              backgroundColor: 'background.default',
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

const IssueTable = React.memo(IssueTableInner);

export default IssueTable;
