import { Typography } from "@mui/material";
import { capitalizeFirstLetter, formatIsoStringToDate } from "../../utils/utils";

export const colDefs = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    suppressMenu: true,
    width: 40,
  },
  {
    field: "id",
    initialWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
    cellRenderer: (params: any): JSX.Element => {
      return <Typography fontFamily={"Poppins"}>{params.data.id}</Typography>;
    },
  },
  {
    field: "firstName",
    headerName: "First Name",
    cellRenderer: (params: any): JSX.Element => {
      return <Typography fontFamily={"Poppins"}>{capitalizeFirstLetter(params.data.firstName)}</Typography>;
    },
  },
  {
    field: "lastName",
    headerName: "Last Name",
    cellRenderer: (params: any): JSX.Element => {
      return <Typography fontFamily={"Poppins"}>{capitalizeFirstLetter(params.data.lastName)}</Typography>;
    },
  },
  {
    field: "email",
    cellRenderer: (params: any): JSX.Element => {
      return <Typography fontFamily={"Poppins"}>{params.data.email}</Typography>;
    },
  },
  {
    field: "birthDate",
    headerName: "Birthday",
    initialWidth: 150,
    filter: "agDateColumnFilter",
    cellRenderer: (params: any): JSX.Element => {
      return (
        <Typography fontFamily={"Poppins"}>{`${formatIsoStringToDate(
          params.data.birthDate,
          "dd/MM/yyyy"
        )}`}</Typography>
      );
    },
  },
  {
    field: "gender",
    initialWidth: 150,
    cellRenderer: (params: any): JSX.Element => {
      return <Typography fontFamily={"Poppins"}>{params.data.gender}</Typography>;
    },
  },
  {
    field: "balance",
    cellRenderer: (params: any): JSX.Element => {
      return <Typography fontFamily={"Poppins"}>{params.data.balance.toLocaleString()}$</Typography>;
    },
  },
  {
    field: "role",
    initialWidth: 150,
    cellRenderer: (params: any): JSX.Element => {
      return <Typography fontFamily={"Poppins"}>{capitalizeFirstLetter(params.data.role)}</Typography>;
    },
  },
];
