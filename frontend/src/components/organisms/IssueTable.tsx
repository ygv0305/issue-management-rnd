// MUI
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Node modules
import React, { useMemo } from 'react';

// Types
import type { IssueData } from '../../types/issueTypes';

// Components
import StatusBadge from '../atoms/StatusBadge';

interface IssueTableProps {
  title?: string;
  issues: IssueData[];
  onIssueSelect: (issue: IssueData) => void;
}

const IssueTableInner = ({ title, issues, onIssueSelect }: IssueTableProps) => {
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: '_id',
        headerName: 'ID',
        headerClassName: 'issue-table-header',
        width: 100,
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
      },
      {
        field: 'createdAt',
        headerName: 'Date',
        headerClassName: 'issue-table-header',
        width: 100,
        valueFormatter: (value?: string) => {
          if (value) {
            return new Date(value).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
            });
          }
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        headerClassName: 'issue-table-header',
        width: 100,
        renderCell: (params: GridRenderCellParams) => (
          <StatusBadge status={params.value} />
        ),
      },
      {
        field: 'priority',
        headerName: 'Priority',
        headerClassName: 'issue-table-header',
        width: 100,
        renderCell: (params: GridRenderCellParams) => (
          <StatusBadge priority={params.value} />
        ),
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
          maxHeight: 500,
          width: '100%',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <DataGrid
          rows={issues}
          columns={columns}
          getRowId={(row) => row._id}
          onRowClick={(params) => onIssueSelect(params.row as IssueData)}
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
