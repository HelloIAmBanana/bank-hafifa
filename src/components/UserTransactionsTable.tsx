import { DataGrid } from "@mui/x-data-grid";
import { TransactionRow } from "../models/transactionRow";
import { Box, Skeleton, Typography } from "@mui/material";
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
      field: "Blank",
      headerName: "",
      width: 150,
    },
    {
      field: "TitleAndField",
      headerName: "",
      width: 175,
      renderCell: (params: any) =>
        params.row.senderID === userID ? (
          <Box>
            <Typography fontWeight={"Bold"} fontFamily={"Poppins"}>{`To ${params.row.receiverName}`}</Typography>
            <Typography fontFamily={"Poppins"}>{`${params.row.date}`}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography fontWeight={"Bold"} fontFamily={"Poppins"}>{`From ${params.row.senderName}`}</Typography>
            <Typography fontFamily={"Poppins"}>{`${params.row.date}`}</Typography>
          </Box>
        ),
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
    { field: "reason", headerName: "" },
  ];

  return (
    <Box sx={{ boxShadow: "5px 6px 7px #850230", borderRadius: 4, padding: 0.5, width: 750, alignItems: "center" }}>
  

        {isTableLoading ? (
        <Box>
          <Skeleton width={650} height={50} />
          <Skeleton width={650} height={100} />
          <Skeleton width={650} height={75} />
          <Skeleton width={650} height={120} />
          <Skeleton width={650} height={75} />
          <Skeleton width={650} height={75} />
          <Skeleton width={650} height={75} />
        </Box>
      ) : (<DataGrid
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
            rowSelection={false}
            disableDensitySelector
            disableAutosize
            sx={{
              fontFamily: "Poppins",
              borderTop: "transparent",
              border: "hidden",
              borderTopColor: "transparent",
            }}
          />
      )}
    </Box>
  );
};

export default UserTransactionsTable;
