import { DataGrid } from "@mui/x-data-grid";
import { TransactionRow } from "../models/transactionRow";
import { Box, Typography } from "@mui/material";

interface UserTransactionsTableProps {
  rows: TransactionRow[];
  isReady: boolean;
}

const UserTransactionsTable: React.FC<UserTransactionsTableProps> = ({
  rows,
  isReady: isTableLoading,
}) => {
  const columns = [
    { field: "senderName", headerName: "Sender", width: 175 },
    { field: "receiverName", headerName: "Receiver", width: 175 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "date", headerName: "Date", width: 175 },
    { field: "reason", headerName: "Reason", width: 450 },
  ];
  return (
    <Box sx={{ boxShadow: "5px 6px 7px #850230", borderRadius: 7, padding: 0.5}}>
      <Typography
        variant="h3"
        fontFamily={"Poppins"}
      >
        Recent Transaction
      </Typography>
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
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          borderRadius: 7,
          borderTop: "transparent",
          backgroundColor: "white",
          borderTopColor: "transparent",
        }}
      />
    </Box>
  );
};

export default UserTransactionsTable;
