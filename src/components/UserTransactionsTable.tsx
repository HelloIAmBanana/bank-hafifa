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
import { formatIsoToDate } from "../utils/utils"
ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface UserTransactionsTableProps {
  transactions: TransactionRow[];
  isLoading: boolean;
  user: string;
}

const UserTransactionsTable: React.FC<UserTransactionsTableProps> = ({
  transactions: transactionsRows,
  isLoading: isTableLoading,
  user: userID,
}) => {
  const colDefs = useMemo(() =>[
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
      cellRenderer: (params: any) =>
        params.data.senderID === userID ? (
          <Box>
            <Typography fontWeight={"Bold"} fontFamily={"Poppins"}>{`${params.data.receiverName}`}</Typography>
            <Typography fontFamily={"Poppins"}>{`At ${formatIsoToDate(params.data.date,"HH:mm")}`}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography fontWeight={"Bold"} fontFamily={"Poppins"}>{`${params.data.senderName}`}</Typography>
            <Typography fontFamily={"Poppins"}>{`At ${formatIsoToDate(params.data.date,"HH:mm")}`}</Typography>
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
        return <Typography fontFamily={"Poppins"}>{`${formatIsoToDate(params.data.date,"dd/MM/yyyy")}`}</Typography>;
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
      filterParams: {
        allowedCharPattern: "\\d\\-\\,\\$",
        numberParser: (text: string | null) => {
          return text == null ? null : parseFloat(text.replace(",", ".").replace("$", ""));
        },
        numberFormatter: (value: number | null) => {
          return value == null ? null : value.toString().replace(".", ",");
        },
      },
    },
    { field: "reason", minWidth: 400, headerName: "" },
  ],[userID]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      suppressMovable: true,
      sortable: true,
      sort:"desc",
    };
  }, []);

  return (
    <Box>
      {isTableLoading ? (
        <Skeleton width={1000} height={570} />
      ) : (
        <Box sx={{ height: 600, width: 1000 }}>
          <div className={"ag-theme-quartz"} style={{ width: "100%", height: "100%" }}>
            <AgGridReact
              rowData={transactionsRows}
              columnDefs={colDefs}
              rowHeight={48}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 25, 50]}
              defaultColDef={defaultColDef}
              animateRows={true}
            />
          </div>
        </Box>
      )}
    </Box>
  );
};

export default UserTransactionsTable;
