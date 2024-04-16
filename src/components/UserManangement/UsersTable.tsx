import React, { useMemo, useState } from "react";
import { useEffect, useContext } from "react";
import { Grid, Box, Container, Typography, Skeleton, Button, Menu, MenuItem} from "@mui/material";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef, RowNode } from "@ag-grid-community/core";
import { useFetchUsersContext } from "../../contexts/fetchUserContext";
import { UserContext } from "../../UserProvider";
import { capitalizeFirstLetter, formatIsoStringToDate} from "../../utils/utils";
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

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
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
        maxWidth: 150,
        cellRenderer: (params: any): JSX.Element => {
          return <Typography fontFamily={"Poppins"}>{capitalizeFirstLetter(params.data.firstName)}</Typography>;
        },
      },
      {
        field: "lastName",
        headerName: "Last Name",
        maxWidth: 150,
        cellRenderer: (params: any): JSX.Element => {
          return <Typography fontFamily={"Poppins"}>{capitalizeFirstLetter(params.data.lastName)}</Typography>;
        },
      },
      {
        field: "email",
        initialWidth: 150,
        flex: 1,
        cellRenderer: (params: any): JSX.Element => {
          return <Typography fontFamily={"Poppins"}>{params.data.email}</Typography>;
        },
      },
      {
        field: "birthDate",
        headerName: "Birthday",
        maxWidth: 150,
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
        maxWidth: 150,
        cellRenderer: (params: any): JSX.Element => {
          return <Typography fontFamily={"Poppins"}>{params.data.gender}</Typography>;
        },
      },
      {
        field: "balance",
        initialWidth: 150,
        flex: 1,
        cellRenderer: (params: any): JSX.Element => {
          return <Typography fontFamily={"Poppins"}>{params.data.balance.toLocaleString()}$</Typography>;
        },
      },
      {
        field: "role",
        flex: 1,
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

  const handleSelectionChanged = () => {
    const selectedNodes = gridApi?.getSelectedNodes();
    setSelectedRows(selectedNodes.map((node: RowNode) => node.data));
  };

  const onCellMouseOver = (params: any) => {
    const hoveredRow: User = params.data;
    setHoveredUser(hoveredRow); // 0

    sessionStorage.setItem("spectatingToken", hoveredRow.id);
  };

  const deleteUser = async (user: User) => {
    if (user.id === currentUser!.id) return;
    await CRUDLocalStorage.deleteItemFromList<User>("users", user);
    successAlert(`Deleted User`);
  };

  const handleDeleteUsersButtonClicked = async () => {
    selectedRows.forEach(async (row) => {
      const user = await CRUDLocalStorage.getItemInList<User>("users", row.id);
      if (user!.id === currentUser!.id) return;
      await CRUDLocalStorage.deleteItemFromList<User>("users", user!);
      successAlert(`Deleted Users`);

    });
  };

  let gridApi: any;

  const onGridReady = (params: any) => {
    gridApi = params.api;
    gridApi.addEventListener("selectionChanged", handleSelectionChanged);
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
                      <Box className="ag-theme-quartz" style={{ width: "100%" }} mt={2}>
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
                        />
                      </Box>
                    </div>
                  </Box>
                  {selectedRows.length > 0 && (
                    <Button type="submit" onClick={handleDeleteUsersButtonClicked}>
                      Delete Selected Users
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
                        onClick={() => {
                          setIsUpdateUserModalOpen(true);
                          handleClose();
                        }}
                      >
                        <Typography fontFamily={"Poppins"}>Edit User</Typography>
                      </MenuItem>

                      <MenuItem onClick={() => deleteUser(hoveredUser!)} divider={true}>
                        <Typography fontFamily={"Poppins"}>Delete User</Typography>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setIsUserLoansModalOpen(true);
                          handleClose();
                        }}
                      >
                        <Typography fontFamily={"Poppins"}>User Loans</Typography>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setIsUserCardsModalOpen(true);
                          handleClose();
                        }}
                      >
                        <Typography fontFamily={"Poppins"}>User Cards</Typography>
                      </MenuItem>
                      <MenuItem
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
