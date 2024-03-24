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

const nameFields = [
  {
    id: "firstName",
    label: "First Name",
    type: "text",
    required: false,
    placeholder: "Enter your first name",
  },
  {
    id: "lastName",
    label: "Last Name",
    type: "text",
    required: false,
    placeholder: "Enter your last name",
  },
];
const passwordFields = [
  {
    id: "password",
    label: "Password",
    type: "password",
    required: false,
    placeholder: "Password",
  },
];
const genderFields = [
  {
    id: "gender",
    label: "Gender",
    type: "select",
    required: false,
    placeholder: "Enter your gender",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
  },
];
const birthdateFields = [
  {
    id: "birthDate",
    label: "Date Of Birth",
    type: "date",
    required: false,
    placeholder: "Enter your birthday",
  },
];

const ProfileSettingsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [nameModal, setNameModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [genderModal, setGenderModal] = useState(false);
  const [birthDateModal, setBirthDateModal] = useState(false);
  const [profilePictureModal, setProfilePictureModal] = useState(false);

  const storeCurrentUser = async () => {
    setCurrentUser(await AuthService.getCurrentUser());
  };
  useEffect(() => {
    storeCurrentUser();
  }, [currentUser]);
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
    await updateUser(updatedUser);
    successAlert(`Updated User!`);
    setIsLoading(false);
  };
  const closeModals = () => {
    setNameModal(false);
    setBirthDateModal(false);
    setProfilePictureModal(false);
    setPasswordModal(false);
    setGenderModal(false);
  };
  const handleNameModal = () => {
    setNameModal(!nameModal);
  };
  const handleBirthDateModal = () => {
    setBirthDateModal(!birthDateModal);
  };
  const handleProfilePictureModal = () => {
    setProfilePictureModal(!profilePictureModal);
  };
  const handlePasswordModal = () => {
    setPasswordModal(!passwordModal);
  };
  const handleGenderModal = () => {
    setGenderModal(!genderModal);
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
      <NavBar />
      {isLoading || !currentUser ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <CircularProgress />
        </Box>
      ) : (
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
              <Button //Name
                onClick={handleNameModal}
              >
                Change Name👤
              </Button>
              <Button //Password
                onClick={handlePasswordModal}
              >
                Change Password🔒
              </Button>
              <Button //Gender
                onClick={handleGenderModal}
              >
                Change Gender🚻
              </Button>
              <Button //Birthday
                onClick={handleBirthDateModal}
              >
                Change Birth Date📆
              </Button>
              <Button //Profile photo
                onClick={handleProfilePictureModal}
              >
                Change Profile Photo🖼️
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
      <Modal //Name
        id="NameChange"
        open={nameModal}
        onClose={handleNameModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GenericModal
          fields={nameFields}
          onSubmit={handleModalSubmit}
          submitButtonLabel="Change Name"
        />
      </Modal>
      <Modal //Password
        id="PasswordChange"
        open={passwordModal}
        onClose={handlePasswordModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GenericModal
          fields={passwordFields}
          onSubmit={handleModalSubmit}
          submitButtonLabel="Change Password"
        />
      </Modal>
      <Modal //Birthday
        id="BirthdayModal"
        open={birthDateModal}
        onClose={handleBirthDateModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GenericModal
          fields={birthdateFields}
          onSubmit={handleModalSubmit}
          submitButtonLabel="Change Birth Date"
        />
      </Modal>
      <Modal //Gender
        id="GenderModal"
        open={genderModal}
        onClose={handleGenderModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GenericModal
          fields={genderFields}
          onSubmit={handleModalSubmit}
          submitButtonLabel="Change Gender"
        />
      </Modal>
      <Modal //Profile Picture
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
