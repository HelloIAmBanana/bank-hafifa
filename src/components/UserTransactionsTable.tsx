import React, { useContext, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { Box, Skeleton, Typography } from "@mui/material";
import CRUDLocalStorage from "../CRUDLocalStorage";
import transferIcon from "../imgs/transaction.png";
import { Transaction } from "../models/transactions";
import { DateTime } from "luxon";
import { UserContext } from "../UserProvider";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
ModuleRegistry.registerModules([ClientSideRowModelModule]);


export default function UserTransactionsTable() {
  const [currentUser] = useContext(UserContext);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [rowData, setRowData] = useState<Transaction[]>([]);

  const [colDefs] = useState<ColDef<Transaction | any>[]>([
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
        params.data.senderID === currentUser?.id ? (
          <Box>
            <Typography fontWeight={"Bold"} fontFamily={"Poppins"}>{`${params.data.receiverName}`}</Typography>
            <Typography fontFamily={"Poppins"}>{`At ${formatToHour(params.data.date)}`}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography fontWeight={"Bold"} fontFamily={"Poppins"}>{`${params.data.senderName}`}</Typography>
            <Typography fontFamily={"Poppins"}>{`At ${formatToHour(params.data.date)}`}</Typography>
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
        return <Typography fontFamily={"Poppins"}>{`${formatToDate(params.data.date)}`}</Typography>;
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
        if (params.data.senderID === currentUser?.id) {
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
        if (params.data.senderID === currentUser?.id) {
          return `${-params.data.amount}$`;
        } else {
          return `+${params.data.amount}$`;
        }
      },
    },
    { field: "reason", minWidth: 400, headerName: "" },
  ]);

  const fetchUserTransactions = async () => {
    setIsTableLoading(true);
    if (currentUser) {
      try {
        const fetchedTransactions = await CRUDLocalStorage.getAsyncData<Transaction[]>("transactions");
        setRowData(fetchedTransactions.reverse());
        setIsTableLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      suppressMovable: true,
      sortable: true,
    };
  }, []);

  const formatToHour = (date: string) => {
    return DateTime.fromISO(date, {
      zone: "Asia/Jerusalem",
    }).toFormat("HH:mm");
  };

  const formatToDate = (date: string) => {
    return DateTime.fromISO(date, {
      zone: "Asia/Jerusalem",
    }).toFormat("dd/MM/yyyy");
  };

  useEffect(() => {
    fetchUserTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <Box>
      {isTableLoading ? (
        <Box>
          <Skeleton width={1000} height={50} />
          <Skeleton width={1000} height={100} />
          <Skeleton width={1000} height={75} />
          <Skeleton width={1000} height={120} />
          <Skeleton width={1000} height={75} />
          <Skeleton width={1000} height={75} />
          <Skeleton width={1000} height={75} />
        </Box>
      ) : (
        <Box sx={{ height: 600, width: 1000 }}>
          <div className={"ag-theme-quartz"} style={{ width: "100%", height: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              rowHeight={48}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 25, 50]}
              defaultColDef={defaultColDef}
            />
          </div>
        </Box>
      )}
    </Box>
  );
}
