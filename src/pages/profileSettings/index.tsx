import * as React from "react";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import GenericModal from "../../components/GenericModal/GenericModal";
import AuthService from "../../AuthService";
import NavBar from "../../components/navigationBar/navBar";
import { useState, useEffect } from "react";
import { User } from "../../models/user";
import { successAlert } from "../../utils/swalAlerts";
import { useNotSignedUser } from "../../hooks/useRememberedUser";
import {
  Button,
  Grid,
  Typography,
  Modal,
  CircularProgress,
  Input,
  Box,
} from "@mui/material";
import * as _ from "lodash";

const ProfileSettingsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePictureModal, setProfilePictureModal] = useState(false);

  const nameFields = [
    {
      id: "firstName",
      label: "First Name",
      type: "text",
      required: false,
      placeholder: `${currentUser?.firstName}`,
    },
    {
      id: "lastName",
      label: "Last Name",
      type: "text",
      required: false,
      placeholder: `${currentUser?.lastName}`,
    },
    {
      id: "birthDate",
      label: "Date Of Birth",
      type: "date",
      required: false,
      placeholder: `${currentUser?.birthDate}`,
    },

    {
      id: "gender",
      label: "Gender",
      type: "select",
      required: false,
      placeholder: `${currentUser?.gender}`,
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
    },
  ];

  const storeCurrentUser = async () => {
    setCurrentUser(await AuthService.getCurrentUser());
  };
  useEffect(() => {
    storeCurrentUser();
  }, []);
  async function updateUser(user: User) {
    const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
    const updatedUsers = users.filter((userItem) => userItem.id !== user.id);
    updatedUsers.push(user as User);
    await CRUDLocalStorage.setAsyncData("users", updatedUsers);
  }
  const handleModalSubmit = async (data: any) => {
    closeModals();
    setIsLoading(true);
    const updatedUser: User = {
      ...(currentUser as User),
      ...data,
    };
    console.log("Updated User: "+(updatedUser as User))
    console.log("Current User: "+(currentUser as User))

    if(!_.isEqual(updatedUser,currentUser)){
      await updateUser(updatedUser);
      successAlert(`Updated User!`);
    }
    setIsLoading(false);
  };
  const closeModals = () => {
    setProfilePictureModal(false);
  };
  const handleProfilePictureModal = () => {
    setProfilePictureModal(!profilePictureModal);
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProfilePictureModal();
      setIsLoading(true);
      const imageUrl: string = URL.createObjectURL(file);
      const updatedUser: User = {
        ...(currentUser as User),
        avatarUrl: imageUrl,
      };
      await updateUser(updatedUser);
      successAlert(`Updated User!`);
      setIsLoading(false);
    }
  };

  useNotSignedUser();

  return (
    <Box mx={30} sx={{ paddingTop: 8 }}>
      {isLoading || !currentUser ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <NavBar />
          <Box
            sx={{
              width: 450,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              justifyContent: "center",
              display: "flex",
              margin: "auto",
              fontFamily: "Poppins",
            }}
          >
            <Grid container spacing={4} justifyContent="center">
              <Grid item>
                <GenericModal
                  fields={nameFields}
                  onSubmit={handleModalSubmit}
                  submitButtonLabel="Update Profile"
                />
                <Button onClick={handleProfilePictureModal}>
                  Change Profile Photo🖼️
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}

      <Modal
        id="ProfilePictureChange"
        open={profilePictureModal}
        onClose={handleProfilePictureModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            gutterBottom
            className="signinLabelNormal"
            sx={{ fontFamily: "Poppins" }}
          >
            Change Profile Picture
          </Typography>
          <Input
            required
            type="file"
            onChange={handleProfilePictureChange}
            sx={{ mt: 2, fontFamily: "Poppins" }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfileSettingsPage;
