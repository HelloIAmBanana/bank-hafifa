import React, { useMemo } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { Box, Skeleton, Typography } from "@mui/material";
import transferIcon from "../imgs/transaction.png";
import { TransactionRow } from "../models/transactionRow";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { formatIsoToDate } from "../utils/utils";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface TransactionsTableProps {
  transactions: TransactionRow[];
  isLoading: boolean;
  userID: string;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  isLoading: isTableLoading,
  transactions,
  userID
}) => {
  const colDefs = useMemo(
    () => [
      {
        field: "",
        cellRenderer: () => (
          <img src={transferIcon} alt="Transfer Icon" color="red" style={{ width: 40, height: 50, color: "red" }} />
        ),
        maxWidth: 50,
        suppressHeaderMenuButton: true,
        initialWidth: 50,
        minWidth: 50,
        suppressHeaderContextMenu: true,
      },
      {
        field: "senderName",
        headerName: "",
        cellRenderer: (params: any) => (
          <Box>
            <Typography fontWeight={"Bold"} fontFamily={"Poppins"}>{`${
              params.data.senderID === userID ? params.data.receiverName : params.data.senderName}`}
            </Typography>
            <Typography fontFamily={"Poppins"}>{`At ${formatIsoToDate(params.data.date, "HH:mm")}`}</Typography>
          </Box>
        ),
      },
      {
        field: "Date",
        maxWidth: 150,
        headerName: "",
        initialWidth: 150,
        minWidth: 150,
        suppressHeaderMenuButton: true,
        suppressHeaderContextMenu: true,
        cellRenderer: (params: any) => {
          return <Typography fontFamily={"Poppins"}>{`${formatIsoToDate(params.data.date, "dd/MM/yyyy")}`}</Typography>;
        },
      },
      {
        field: "",
        maxWidth: 60,
        initialWidth: 60,
        minWidth: 60,
        suppressHeaderMenuButton: true,
        suppressHeaderContextMenu: true,
        cellRenderer: (params: any) => {
          if (params.data.senderID === userID) {
            return <TrendingDown sx={{ color: "red" }} />;
          } else {
            return <TrendingUp sx={{ color: "green" }} />;
          }
        },
      },
      {
        field: "amount",
        maxWidth: 100,
        initialWidth: 100,
        minWidth: 100,
        headerName: "",
        cellRenderer: (params: any) => {
          if (params.data.senderID === userID) {
            return `${-params.data.amount}$`;
          } else {
            return `+${params.data.amount}$`;
          }
        },
        
      },
      { field: "reason", minWidth: 400, headerName: "" },
    ],
    [userID]
  );
  
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      suppressMovable: true,
    };
  }, []);

  return (
<Box sx={{  width: "100%" }}>      {isTableLoading ? (
        <Skeleton width={1000} height="100%" />
      ) : (
          <div className="ag-theme-quartz" style={{ width: "100%"}}>
            <AgGridReact
              rowData={transactions}
              columnDefs={colDefs}
              domLayout="autoHeight"
              rowHeight={48}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 25, 50]}
              defaultColDef={defaultColDef}
              animateRows={true}
            />
          </div>
      )}
    </Box>
  );
};

export default TransactionsTable;
