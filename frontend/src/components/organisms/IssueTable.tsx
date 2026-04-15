// MUI
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
import { getIssueTypesFromStorage } from '../../hooks/issue/useCreateIssue';

interface IssueTableProps {
  title?: string;
  issues: IssueData[];
  onIssueSelect: (issue: IssueData) => void;
}

const IssueStatusArr: IssueStatus[] = [
  'New',
  'InProgress',
  'Resolved',
  'ReOpen',
  'Closed',
];

const IssuePrioArr: IssuePriority[] = ['Low', 'Medium', 'High', 'Critical'];

const IssueTypeArr = getIssueTypesFromStorage().map((e) => e.name);

const IssueTableInner = ({ title, issues, onIssueSelect }: IssueTableProps) => {
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
      },
    ],
    [],
  );

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {title && (
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          {title}
        </Typography>
      )}

      <Box
        sx={{
          maxHeight: '80vh',
          width: '100%',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
          overflowY: 'auto',
        }}
      >
        <DataGrid
          rows={issues}
          columns={columns}
          getRowId={(row) => row._id}
          onRowClick={(params) => onIssueSelect(params.row as IssueData)}
          showToolbar
          initialState={{
            pagination: {
              paginationModel: { pageSize: 15 },
            },
          }}
          pageSizeOptions={[15, 30, 50]}
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
