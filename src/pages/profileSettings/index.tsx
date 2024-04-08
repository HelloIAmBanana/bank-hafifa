import React, { useState, useContext, useMemo } from "react";
import { User } from "../../models/user"; 
import { successAlert } from "../../utils/swalAlerts";
import Ajv, { JSONSchemaType } from "ajv";
import ajvErrors from "ajv-errors";
import { Button, Grid, Typography, Modal, CircularProgress, Input, Box } from "@mui/material";
import { UserContext } from "../../UserProvider";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import NavBar from "../../components/NavigationBar/NavBar";
import * as _ from "lodash";
import GenericForm from "../../components/GenericForm/GenericForm";
import { PacmanLoader } from "react-spinners";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const schema: JSONSchemaType<User> = {
  type: "object",
  properties: {
    id: { type: "string" },
    firstName: { type: "string", minLength: 1 },
    lastName: { type: "string", minLength: 1 },
    email: { type: "string", pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$" },
    password: { type: "string", minLength: 6 },
    birthDate: { type: "string", minLength: 1 },
    avatarUrl: { type: "string" },
    gender: { type: "string", enum: ["Male", "Female"], minLength: 1 },
    accountType: { type: "string", enum: ["Business", "Personal"] },
    role: { type: "string", enum: ["admin", "customer"] },
    balance: { type: "number" },
  },
  required: [],
  additionalProperties: true,
  errorMessage: {
    properties: {
      firstName: "Enter Your First Name",
      lastName: "Enter Your Last Name",
      birthDate: "Enter Your Birthdate",
      gender: "Please Select Your Gender",
    },
  },
};

const validateForm = ajv.compile(schema);

const ProfileSettingsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isProfilePicLoading, setIsProfilePicLoading] = useState(false);
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);

  const fields = useMemo(() => {
    return [
      {
        id: "firstName",
        label: "First Name",
        type: "text",
        initValue: `${currentUser?.firstName}`,
      },
      {
        id: "lastName",
        label: "Last Name",
        type: "text",
        initValue: `${currentUser?.lastName}`,
      },
      {
        id: "birthDate",
        label: "Date Of Birth",
        type: "date",
        initValue: `${currentUser?.birthDate}`,
      },

      {
        id: "gender",
        label: "Gender",
        type: "select",
        initValue: `${currentUser?.gender}`,
        options: [
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ],
      },
    ];
  }, [currentUser]);

  const updateCurrentUser = async (updatedCurrentUser: User) => {
    await CRUDLocalStorage.updateItemInList<User>("users", updatedCurrentUser);
    setCurrentUser(updatedCurrentUser);
    successAlert(`Updated User!`);
  };

  const handleSubmitProfileInfo = async (data: any) => {
    setIsFormLoading(true);
    if (validateForm(data)) {
      const updatedUser: User = {
        ...(currentUser as User),
        ...data,
      };
      if (!_.isEqual(updatedUser, currentUser)) {
        await updateCurrentUser(updatedUser);
      }
    }
    setIsFormLoading(false);
  };

  const openProfilePicModal = () => {
    setIsProfilePictureModalOpen(true);
  };

  const closeProfilePicModal = () => {
    setIsProfilePictureModalOpen(false);
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProfilePicLoading(true);
      const imageUrl: string = URL.createObjectURL(file);
      const updatedUser: User = {
        ...(currentUser as User),
        avatarUrl: imageUrl,
      };
      await updateCurrentUser(updatedUser);
      setIsProfilePicLoading(false);
      closeProfilePicModal();
    }
  };

  document.title = "Account Settings";

  return !currentUser ? (
    <Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <PacmanLoader color="#ffe500" size={50} />
    </Grid>
  ) : (
    <Box sx={{ display: "flex", backgroundColor: "white"}}>
      <NavBar />
      <Grid container direction="column" justifyContent="flex-start" alignItems="center"  marginTop={25}>
        <Grid item>
          <GenericForm
            fields={fields}
            onSubmit={handleSubmitProfileInfo}
            submitButtonLabel="Update Profile"
            schema={schema}
            isLoading={isFormLoading}
          />
          <Button type="submit" onClick={openProfilePicModal}>
            Change Profile Photo🖼️
          </Button>
        </Grid>
      </Grid>

      <Modal
        id="ProfilePictureChange"
        open={isProfilePictureModalOpen}
        onClose={closeProfilePicModal}
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
          <Typography id="modal-title" variant="h6" gutterBottom sx={{ fontFamily: "Poppins" }}>
            Change Profile Picture
          </Typography>
          {isProfilePicLoading ? (
            <center>
              <CircularProgress />
            </center>
          ) : (
            <Input type="file" onChange={handleProfilePictureChange} sx={{ mt: 2, fontFamily: "Poppins" }} />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfileSettingsPage;
