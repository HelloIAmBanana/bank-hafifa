import React, { useMemo } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { Box, Typography } from "@mui/material";
import transactionIcon from "../imgs/Icons/Transaction.png";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { formatIsoStringToDate } from "../utils/utils";
import { TransactionRow } from "../models/transactionRow";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface TransactionsTableProps {
  transactions: TransactionRow[];
  userID: string;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, userID }) => {
  const colDefs = useMemo(
    () => [
      {
        field: "",
        cellRenderer: () => (
          <img src={transactionIcon} alt="Transfer Icon" color="red" style={{ width: 40, height: 50, color: "red" }} />
        ),
        suppressHeaderMenuButton: true,
        initialWidth: 50,
        suppressHeaderContextMenu: true,
      },
      {
        field: "senderName",
        cellRenderer: (params: any) => (
          <Box>
            <Typography fontWeight={"Bold"} fontFamily={"Poppins"}>
              {params.data.senderID === userID ? `To ${params.data.receiverName}` : `From ${params.data.senderName}`}
            </Typography>
            <Typography fontFamily={"Poppins"}>{`At ${formatIsoStringToDate(params.data.date, "HH:mm")}`}</Typography>
          </Box>
        ),
      },
      {
        field: "Date",
        initialWidth: 150,
        suppressHeaderMenuButton: true,
        suppressHeaderContextMenu: true,
        cellRenderer: (params: any) => {
          return <Typography fontFamily={"Poppins"}>{`${formatIsoStringToDate(params.data.date, "dd/MM/yyyy")}`}</Typography>;
        },
      },
      {
        field: "",
        initialWidth: 60,
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
        initialWidth: 100,
        cellRenderer: (params: any) => {
          if (params.data.senderID === userID) {
            return `${-params.data.amount}$`;
          } else {
            return `+${params.data.amount}$`;
          }
        },
      },
      { field: "reason", minWidth: 400,flex: 1},
    ],
    [userID]
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      suppressMovable: true,
      headerName:"",
      resizable:false
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box className="ag-theme-quartz" style={{ width: "100%" }}>
        <AgGridReact
          rowData={transactions}
          columnDefs={colDefs}
          domLayout="autoHeight"
          rowHeight={48}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10]}
          defaultColDef={defaultColDef}
        />
      </Box>
    </Box>
  );
};

export default TransactionsTable;
