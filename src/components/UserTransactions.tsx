import { DataGrid } from "@mui/x-data-grid";

interface Row {
    id: string;
    senderID: string;
    receiverID: string;
    amount: string;
    reason: string;
  }
export const UserTransactionDataGrid=(rows:Row[])=>{
    const columns = [
        { field: "senderName", headerName: "Sender", width: 200 },
        { field: "receiverName", headerName: "Receiver", width: 200 },
        { field: "reason", headerName: "Reason", width: 150 },
        { field: "amount", headerName: "Amount", width: 150 },
      ];

      return(
        <DataGrid
                rows={rows}
                columns={columns}
                autoHeight={true}
                getRowId={(rowData) => rowData.id}
                disableColumnMenu
                disableRowSelectionOnClick
                disableColumnSorting
                disableColumnSelector
                autoPageSize={true}
                disableColumnResize
                hideFooter
                sx={{
                  border:"double",
                  fontFamily:"Poppins",
                  opacity:"85%",
                  boxShadow: 24,
                  borderRadius: 3,
                  color:"black",
                  backgroundColor:"#e090ac",
                  floodColor: "#F50057",
                }}
              />
      )
}