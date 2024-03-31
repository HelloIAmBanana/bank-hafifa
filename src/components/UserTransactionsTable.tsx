import { DataGrid } from "@mui/x-data-grid";
import { TransactionRow } from "../models/transactionRow";
import { Box } from "@mui/material";

interface UserTransactionsTableProps {
  rows: TransactionRow[];
  isLoading: boolean;
}

const UserTransactionsTable: React.FC<UserTransactionsTableProps> = ({
  rows,
  isLoading: isTableLoading,
}) => {
  const columns = [
    { field: "senderName", headerName: "From", width: 175 },
    { field: "receiverName", headerName: "To", width: 175 },
    { field: "amount", headerName: "", width: 100 },
    { field: "date", headerName: "", width: 175 },
    { field: "reason", headerName: "", width: 450 },
  ];
  return (
    <Box sx={{ boxShadow: "5px 6px 7px #850230", borderRadius: 4, padding: 0.5}}>
      <DataGrid
        rows={rows.slice(-10)}
        columns={columns}
        getRowId={(rowData) => rowData.id}
        disableColumnMenu
        autoHeight={true}
        disableRowSelectionOnClick
        disableColumnSorting
        disableColumnSelector
        autoPageSize={true}
        disableColumnResize
        disableColumnFilter
        hideFooter
        loading={isTableLoading}
        sx={{
          fontFamily: "Poppins",
          borderTop: "transparent",
          border:"hidden",
          borderTopColor: "transparent",
        }}
      />
    </Box>
  );
};

export default UserTransactionsTable;
