import { DataGrid } from "@mui/x-data-grid";
import { TransactionRow } from "../models/transactionRow";
import { Box } from "@mui/material";
import { TrendingDown, TrendingUp } from "@mui/icons-material";

interface UserTransactionsTableProps {
  rows: TransactionRow[];
  isLoading: boolean;
  currentUserID: string;
}

const UserTransactionsTable: React.FC<UserTransactionsTableProps> = ({
  rows,
  isLoading: isTableLoading,
  currentUserID: userID,
}) => {
  const columns = [
    {
      field: "TitleAndField",
      headerName: "",
      width: 350,
      renderCell: (params: any) =>
        params.row.senderID === userID
          ? `To ${params.row.receiverName} (${params.row.date})`
          : `From ${params.row.senderName} (${params.row.date})`,
    },
    {
      field: "icon",
      headerName: "",
      width: 50,
      renderCell: (params: any) => {
        if (params.row.amount[0] === "-") {
          return <TrendingDown sx={{ color: "red" }} />;
        } else {
          return <TrendingUp sx={{ color: "green" }} />;
        }
      },
    },
    
    { field: "amount", headerName: "", width: 100 },
    { field: "reason", headerName: "", width: 450 },
  ];
  return (
    <Box
      sx={{ boxShadow: "5px 6px 7px #850230", borderRadius: 4, padding: 0.5 }}
    >
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
          border: "hidden",
          borderTopColor: "transparent",
        }}
      />
    </Box>
  );
};

export default UserTransactionsTable;
