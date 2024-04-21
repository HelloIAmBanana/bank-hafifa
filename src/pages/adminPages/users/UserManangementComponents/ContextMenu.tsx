import { CircularProgress, Menu, MenuItem, Typography } from "@mui/material";
import { User } from "../../../../models/user";
import { useNavigate } from "react-router-dom";

interface TableContextMenuProps {
  contextMenuPos: {
    mouseX: number;
    mouseY: number;
  } | null;
  handleContextMenu: (event: React.MouseEvent) => void;
  handleClose: () => void;
  isContextMenuDeleting: boolean;
  hoveredUser: User;
  contextMenuDeleteUser: (user: User) => Promise<void>;
  setIsUpdateUserModalOpen: (value: React.SetStateAction<boolean>) => void;
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({
  contextMenuPos,
  handleClose,
  isContextMenuDeleting,
  hoveredUser,
  contextMenuDeleteUser,
  setIsUpdateUserModalOpen
}) => {
  const navigate = useNavigate();

  return (
    <Menu
      open={contextMenuPos !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={contextMenuPos !== null ? { top: contextMenuPos.mouseY, left: contextMenuPos.mouseX } : undefined}
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
      <MenuItem onClick={() => contextMenuDeleteUser(hoveredUser!)} divider={true} disabled={isContextMenuDeleting}>
        <Typography fontFamily={"Poppins"}>
          {isContextMenuDeleting ? <CircularProgress size={15} /> : "Delete User"}
        </Typography>
      </MenuItem>
      <MenuItem
        disabled={isContextMenuDeleting}
        onClick={() => {
          navigate(`/admin/users/loans/${hoveredUser.id}`);
        }}
      >
        <Typography fontFamily={"Poppins"}>User Loans</Typography>
      </MenuItem>
      <MenuItem
        disabled={isContextMenuDeleting}
        onClick={() => {
          navigate(`/admin/users/cards/${hoveredUser.id}`)
        }}
      >
        <Typography fontFamily={"Poppins"}>User Cards</Typography>
      </MenuItem>
      <MenuItem
        disabled={isContextMenuDeleting}
        onClick={() => {
          navigate(`/admin/users/deposits/${hoveredUser.id}`)
        }}
      >
        <Typography fontFamily={"Poppins"}>User Deposits</Typography>
      </MenuItem>
    </Menu>
  );
};

export default TableContextMenu;