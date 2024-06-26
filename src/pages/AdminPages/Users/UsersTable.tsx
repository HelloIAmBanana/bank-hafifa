import React, { useCallback, useMemo, useState } from "react";
import { useEffect, useContext } from "react";
import { Grid, Box, Container, Skeleton, Button, CircularProgress } from "@mui/material";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { CellMouseOverEvent, ColDef, IRowNode, RowNode, SelectionChangedEvent } from "@ag-grid-community/core";
import { useFetchUsersContext } from "../../../contexts/fetchUserContext";
import { UserContext } from "../../../UserProvider";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import { User } from "../../../models/user";
import _ from "lodash";
import { successAlert } from "../../../utils/swalAlerts";
import { colDefs } from "./UserTableColumns";
import TableContextMenu from "./ContextMenu";
import EditUserModal from "./EditUser";

const getRowColor = (params: any) => {
  const inDebt = params.data.balance < 0;
  return inDebt ? { background: "red" } : { background: "white" };
};

const UsersTable: React.FC = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const { fetchUsers, isLoading, users } = useFetchUsersContext();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [hoveredUser, setHoveredUser] = useState<User>(currentUser!);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isContextMenuDeleting, setIsContextMenuDeleting] = useState(false);
  const [isDeletingRow, setIsDeletingRow] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    if (isContextMenuDeleting) return;
    event.preventDefault();
    setContextMenuPos(
      contextMenuPos === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleClose = () => {
    if (isContextMenuDeleting) return;
    setContextMenuPos(null);
  };

  const handleCloseUserEditModal = () => {
    setIsUpdateUserModalOpen(false);
  };


  const defaultColDef = useMemo<ColDef>(() => {
    return {
      suppressMovable: true,
      filter: "agTextColumnFilter",
      menuTabs: ["filterMenuTab"],
    };
  }, []);

  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedNodes = event.api.getSelectedNodes();
    const rows = selectedNodes.map((node: IRowNode<any>) => node as RowNode<any>).map((node) => node.data);
    setSelectedRows(rows);
  }, []);

  const onCellHover = useCallback((event: CellMouseOverEvent) => {
    const hoveredCell: User = event.data;
    setHoveredUser(hoveredCell);
  }, []);

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
  }, []);

  return (
      <Container sx={{ mt: 2 }}>
        <Grid container spacing={5} justifyContent="flex-start">
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
                          rowSelection="multiple"
                          onSelectionChanged={onSelectionChanged}
                          onCellMouseOver={onCellHover}
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
                    <TableContextMenu
                      contextMenuDeleteUser={contextMenuDeleteUser}
                      contextMenuPos={contextMenuPos}
                      handleClose={handleClose}
                      handleContextMenu={handleContextMenu}
                      hoveredUser={hoveredUser!}
                      isContextMenuDeleting={isContextMenuDeleting}
                      setIsUpdateUserModalOpen={setIsUpdateUserModalOpen}
                    />
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
      </Container>
  );
};
export default UsersTable;