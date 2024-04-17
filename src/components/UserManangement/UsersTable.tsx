import React, { useCallback, useMemo, useState } from "react";
import { useEffect, useContext } from "react";
import { Grid, Box, Container, Typography, Skeleton, Button, Menu, MenuItem, CircularProgress } from "@mui/material";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef, IRowNode, RowNode, SelectionChangedEvent } from "@ag-grid-community/core";
import { useFetchUsersContext } from "../../contexts/fetchUserContext";
import { UserContext } from "../../UserProvider";
import { capitalizeFirstLetter, formatIsoStringToDate } from "../../utils/utils";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { User } from "../../models/user";
import _ from "lodash";
import { successAlert } from "../../utils/swalAlerts";
import EditUserModal from "./EditUser";
import UserCardsModal from "./UserCards";
import UserLoansModal from "./UserLoans";
import UserDepositsModal from "./UserDeposits";

const UsersTable: React.FC = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const { fetchUsers, isLoading, users } = useFetchUsersContext();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [hoveredUser, setHoveredUser] = useState<User>(currentUser!);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isUserLoansModalOpen, setIsUserLoansModalOpen] = useState(false);
  const [isUserCardsModalOpen, setIsUserCardsModalOpen] = useState(false);
  const [isUserDepositsModalOpen, setIsUserDepositsModalOpen] = useState(false);
  const [isContextMenuDeleting, setIsContextMenuDeleting] = useState(false);
  const [isDeletingRow, setIsDeletingRow] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    if (isContextMenuDeleting) return;
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleClose = () => {
    if (isContextMenuDeleting) return;
    setContextMenu(null);
  };

  const handleCloseUserEditModal = () => {
    setIsUpdateUserModalOpen(false);
  };

  const handleCloseUserLoansModal = () => {
    setIsUserLoansModalOpen(false);
  };

  const handleCloseUserCardsModal = () => {
    setIsUserCardsModalOpen(false);
  };

  const handleCloseUserDepositsModal = () => {
    setIsUserDepositsModalOpen(false);
  };

  const getRowColor = (params: any) => {
    const inDebt = params.data.balance < 0;
    return inDebt ? { background: "red" } : { background: "white" };
  };

  const colDefs = useMemo(
    () => [
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
    ],
    [users]
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      suppressMovable: true,
      filter: "agTextColumnFilter",
      menuTabs: ["filterMenuTab"],
    };
  }, []);

  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedNodes = event.api.getSelectedNodes();
    setSelectedRows(selectedNodes.map((node: IRowNode<any>) => node as RowNode<any>).map((node) => node.data));
  }, []);

  const onCellMouseOver = (params: any) => {
    const hoveredRow: User = params.data;
    setHoveredUser(hoveredRow);
  };

  const contextMenuDeleteUser = async (user: User) => {
    if (user.id === currentUser!.id) return;
    setIsContextMenuDeleting(true);
    await CRUDLocalStorage.deleteItemFromList<User>("users", user);
    await fetchUsers();
    successAlert(`Deleted User`);
    setIsContextMenuDeleting(false);
  };

  const handleDeleteUsersButtonClicked = async () => {
    setIsDeletingRow(true);
    selectedRows.forEach(async (row) => {
      const user = await CRUDLocalStorage.getItemInList<User>("users", row.id);
      if (user!.id === currentUser!.id) return;
      await CRUDLocalStorage.deleteItemFromList<User>("users", user!);
    });
    await fetchUsers();
    setIsDeletingRow(false);
    successAlert(`Deleted Users`);
  };

  let gridApi: any;

  const onGridReady = (params: any) => {
    gridApi = params.api;
    gridApi.addEventListener("cellMouseOver", onCellMouseOver);
  };

  const handleUpdateUser = async (data: any) => {
    setIsUpdatingProfile(true);
    const updatedUser: User = {
      ...hoveredUser!,
      ...data,
    };
    if (!_.isEqual(updatedUser, currentUser)) {
      await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);

      await fetchUsers();

      successAlert(`Updated User!`);
      if (hoveredUser.id === currentUser!.id) {
        setCurrentUser(updatedUser);
      }
    }
    setIsUpdatingProfile(false);
    setIsUpdateUserModalOpen(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <Grid container justifyContent="flex-start">
      <Container sx={{ mt: 2 }}>
        <Grid container spacing={5}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
              {isLoading ? (
                <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                  <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                </Grid>
              ) : (
                <Grid container mt={2}>
                  <Box sx={{ width: "100%" }}>
                    <div onContextMenu={handleContextMenu}>
                      <Box className="ag-user-management" style={{ width: "100%" }} mt={2}>
                        <AgGridReact
                          rowData={users}
                          columnDefs={colDefs}
                          domLayout="autoHeight"
                          rowHeight={48}
                          pagination={true}
                          paginationPageSize={10}
                          getRowStyle={getRowColor}
                          paginationPageSizeSelector={[10]}
                          defaultColDef={defaultColDef}
                          onGridReady={onGridReady}
                          rowSelection="multiple"
                          onSelectionChanged={onSelectionChanged}
                        />
                      </Box>
                    </div>
                  </Box>
                  {selectedRows.length > 0 && (
                    <Button type="submit" disabled={isDeletingRow} onClick={handleDeleteUsersButtonClicked}>
                      {isDeletingRow ? <CircularProgress /> : "Delete Selected Users"}
                    </Button>
                  )}
                  <div onContextMenu={handleContextMenu} style={{ cursor: "context-menu" }}>
                    <Menu
                      open={contextMenu !== null}
                      onClose={handleClose}
                      anchorReference="anchorPosition"
                      anchorPosition={
                        contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
                      }
                    >
                      <MenuItem
                        disabled={isContextMenuDeleting}
                        onClick={() => {
                          setIsUpdateUserModalOpen(true);
                          handleClose();
                        }}
                      >
                        <Typography fontFamily={"Poppins"}>Edit User</Typography>
                      </MenuItem>

                      <MenuItem
                        onClick={() => contextMenuDeleteUser(hoveredUser!)}
                        divider={true}
                        disabled={isContextMenuDeleting}
                      >
                        <Typography fontFamily={"Poppins"}>
                          {isContextMenuDeleting ? <CircularProgress size={15} /> : "Delete User"}
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        disabled={isContextMenuDeleting}
                        onClick={() => {
                          setIsUserLoansModalOpen(true);
                          handleClose();
                        }}
                      >
                        <Typography fontFamily={"Poppins"}>User Loans</Typography>
                      </MenuItem>
                      <MenuItem
                        disabled={isContextMenuDeleting}
                        onClick={() => {
                          setIsUserCardsModalOpen(true);
                          handleClose();
                        }}
                      >
                        <Typography fontFamily={"Poppins"}>User Cards</Typography>
                      </MenuItem>
                      <MenuItem
                        disabled={isContextMenuDeleting}
                        onClick={() => {
                          setIsUserDepositsModalOpen(true);
                          handleClose();
                        }}
                      >
                        <Typography fontFamily={"Poppins"}>User Deposits</Typography>
                      </MenuItem>
                    </Menu>
                  </div>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
        <EditUserModal
          closeModal={handleCloseUserEditModal}
          isLoading={isUpdatingProfile}
          isOpen={isUpdateUserModalOpen}
          user={hoveredUser!}
          updateProfile={handleUpdateUser}
        />
        <UserLoansModal isOpen={isUserLoansModalOpen} closeModal={handleCloseUserLoansModal} user={hoveredUser} />
        <UserCardsModal isOpen={isUserCardsModalOpen} closeModal={handleCloseUserCardsModal} user={hoveredUser} />
        <UserDepositsModal
          isOpen={isUserDepositsModalOpen}
          closeModal={handleCloseUserDepositsModal}
          user={hoveredUser}
        />
      </Container>
    </Grid>
  );
};

export default UsersTable;
