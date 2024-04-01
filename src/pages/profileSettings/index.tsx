import * as React from "react";
import { useState, useContext, useMemo } from "react";
import { User } from "../../models/user";
import { successAlert } from "../../utils/swalAlerts";
import Ajv, { JSONSchemaType } from "ajv";
import ajvErrors from "ajv-errors";
import { Button, Grid, Typography, Modal, CircularProgress, Input, Box } from "@mui/material";
import { UserContext } from "../../UserProvider";
import { updateUser } from "../../utils/utils";
import NavBar from "../../components/NavigationBar/NavBar";
import * as _ from "lodash";
import GenericForm from "../../components/GenericForm/GenericForm";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const schema: JSONSchemaType<User> = {
  type: "object",
  properties: {
    id: { type: "string" },
    firstName: { type: "string", minLength: 1 },
    lastName: { type: "string", minLength: 1 },
    hobbies: { type: "array", items: { type: "string" } },
    email: { type: "string", pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$" },
    password: { type: "string", minLength: 6 },
    birthDate: { type: "string", minLength: 1 },
    avatarUrl: { type: "string" },
    gender: { type: "string", enum: ["Male", "Female"], minLength: 1 },
    accountType: { type: "string", enum: ["Business", "Personal"] },
    role: { type: "string", enum: ["admin", "customer"] },
    balance: { type: "number" },
    cardsAmount:{ type: "number" },

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

const ProfileSettingsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
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
    await updateUser(updatedCurrentUser);
    setCurrentUser(updatedCurrentUser);
    successAlert(`Updated User!`);
  };

  const handleSubmitProfileInfo = async (data: any) => {
    setIsLoading(true);
    const updatedUser: User = {
      ...(currentUser as User),
      ...data,
    };
    if (!_.isEqual(updatedUser, currentUser)) {
      await updateCurrentUser(updatedUser);
    }
    setIsLoading(false);
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
      closeProfilePicModal();
      setIsLoading(true);
      const imageUrl: string = URL.createObjectURL(file);
      const updatedUser: User = {
        ...(currentUser as User),
        avatarUrl: imageUrl,
      };
      await updateCurrentUser(updatedUser);
      setIsLoading(false);
    }
  };

  document.title = "Porfile Settings";


  return (
    <Box mx={30} sx={{ paddingTop: 8 }}>
      <NavBar />
      {isLoading || !currentUser ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
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
                <center>
                  <GenericForm
                    fields={fields}
                    onSubmit={handleSubmitProfileInfo}
                    submitButtonLabel="Update Profile"
                    schema={schema}
                  ></GenericForm>
                  <Button onClick={openProfilePicModal}>Change Profile Photo🖼️</Button>
                </center>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}

      <Modal
        id="ProfilePictureChange"
        open={isProfilePictureModalOpen}
        onClose={closeProfilePicModal}
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
          <Input type="file" onChange={handleProfilePictureChange} sx={{ mt: 2, fontFamily: "Poppins" }} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfileSettingsPage;
