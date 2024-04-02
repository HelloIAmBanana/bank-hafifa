import { DataGrid } from '@mui/x-data-grid';
import { TransactionRow } from "../models/transactionRow";
import { Box, Skeleton, Typography } from "@mui/material";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import transferIcon from "../imgs/transaction.png";

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
      headerName: "All",
      width: 50,
      renderHeader: () => (
        <Typography sx={{ color: "red" }} fontWeight={"Bold"} fontFamily={"Poppins"}>
          All
        </Typography>),
      renderCell:()=>(
          <img src={transferIcon} alt="Transfer Icon" color='red' style={{ width: 40, height: 50 , color:"red"}} />
      )
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

  const reversedRows = [...rows].reverse();

  return (
    <Box>
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
      ) : (
        <Box sx={{height:500, width:750}}>
        <DataGrid
          rows={reversedRows}
          columns={columns}
          getRowId={(rowData) => rowData.id}
          disableColumnMenu
          disableRowSelectionOnClick
          disableColumnSorting
          disableColumnSelector
          disableColumnResize
          disableColumnFilter
          autoPageSize 
          rowSelection={false}
          disableDensitySelector
          autoHeight={false}
          sx={{
            fontFamily: "Poppins",
            borderTop: "transparent",
            border: "hidden",
            borderTopColor: "transparent",
          }}
        />
        </Box>
      )}
    </Box>
  );
};

export default UserTransactionsTable;
