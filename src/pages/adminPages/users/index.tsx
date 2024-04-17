import React, { useState } from "react";
import { useEffect, useContext } from "react";
import { Grid, Box, Container, Typography, Button, Modal } from "@mui/material";
import { UserContext } from "../../../UserProvider";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { useFetchUsersContext } from "../../../contexts/fetchUserContext";
import UsersTable from "../../../components/UserManangement/UsersTable";
import GenericForm from "../../../components/GenericForm/GenericForm";
import { JSONSchemaType } from "ajv";
import { User } from "../../../models/user";
import { doesUserExist, exportToExcel, generateUniqueId } from "../../../utils/utils";
import { errorAlert, successAlert } from "../../../utils/swalAlerts";
import CRUDLocalStorage from "../../../CRUDLocalStorage";

const fields = [
  {
    id: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter first name",
  },
  {
    id: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter last name",
  },
  {
    id: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter email",
  },
  {
    id: "password",
    label: "Password",
    type: "text",
    placeholder: "Enter Password",
  },
  {
    id: "birthDate",
    label: "Date Of Birth",
    type: "date",
    placeholder: "Enter birthday",
  },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
  },
  {
    id: "accountType",
    label: "Account Type",
    type: "select",
    options: [
      { value: "Personal", label: "Personal" },
      { value: "Business", label: "Business" },
    ],
  },
  {
    id: "role",
    label: "Account Role",
    type: "select",
    options: [
      { value: "admin", label: "Admin" },
      { value: "customer", label: "Customer" },
    ],
  },
  {
    id: "balance",
    label: "Balance",
    type: "number",
    initValue: 0,
  },
  {
    id: "avatarUrl",
    label: "Profile Picture",
    type: "file",
  },
];
const schema: JSONSchemaType<User> = {
  type: "object",
  properties: {
    id: { type: "string" },
    firstName: { type: "string", minLength: 1 },
    lastName: { type: "string", minLength: 1 },
    email: { type: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
    password: { type: "string", minLength: 6 },
    birthDate: { type: "string", minLength: 1 },
    avatarUrl: { type: "string" },
    gender: { type: "string", enum: ["Male", "Female"], minLength: 1 },
    accountType: { type: "string", enum: ["Business", "Personal"], minLength: 1 },
    role: { type: "string", enum: ["admin", "customer"], minLength: 1 },
    balance: { type: "number" },
  },
  required: ["birthDate", "email", "firstName", "lastName", "password", "gender", "accountType", "role", "balance"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      email: "Entered Email Is Invalid.",
      password: "Entered Password Is Less Than 6 Characters.",
      firstName: "Enter First Name",
      lastName: "Enter Last Name",
      birthDate: "Enter Birthdate",
      gender: "Please Select Gender",
      accountType: "Please Select Account Type",
      role: "Please Select Account Role",
      balance: "Please Enter A Number Larger Than 0",
    },
  },
};
const AdminUsersPage: React.FC = () => {
  const { fetchUsers, users } = useFetchUsersContext();
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isUserCreationModalOpen, setIsUserCreationModalOpen] = useState(false);

  const closeUserCreationModal = () => {
    if (isCreatingUser) return;
    setIsUserCreationModalOpen(false);
  };

  const createUser = async (data: any) => {
    const newUser: User = {
      ...data,
      id: generateUniqueId(),
      email: data.email.toLowerCase(),
    };

    setIsCreatingUser(true);

    const isDuplicatedUser = await doesUserExist(newUser.email);

    if (isDuplicatedUser) {
      errorAlert("User already exists!");
      setIsCreatingUser(false);
      return;
    }

    await CRUDLocalStorage.addItemToList<User>("users", newUser);
    await fetchUsers();
    setIsCreatingUser(false);
    successAlert("Account Created!");
    closeUserCreationModal();
  };

  const handleOpenCreationModal = () => {
    setIsUserCreationModalOpen(true);
  };

  const onExportButtonClick=()=>{
    exportToExcel<User>("users", users)
  }

  document.title = "Users Management";
console.log("User Page")

  return (
    <Grid container justifyContent="flex-start">
      <Box component="main" sx={{ ml: 20 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={5}>
                  <Grid item xs={12}>
                    <Typography variant="h3" fontFamily="Poppins">
                      Users
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={2}>
                  <Grid item>
                    <Button type="submit" onClick={onExportButtonClick}>
                      Export to Excel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button type="submit" onClick={handleOpenCreationModal}>
                      Create New User
                    </Button>
                  </Grid>
                </Grid>
                <Grid container mt={2} xs={12}>
                  <Box sx={{ width: "100%" }}>
                    <Box className="ag-theme-quartz" style={{ width: "100%" }}>
                      <UsersTable />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Modal
        open={isUserCreationModalOpen}
        onClose={closeUserCreationModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            width: 360,
            bgcolor: "white",
            borderRadius: 5,
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          <center>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: "Poppins", color: "black", fontWeight: "bold" }}>
              Create User
            </Typography>
            <Grid item mx="auto">
              <GenericForm
                fields={fields}
                onSubmit={createUser}
                schema={schema}
                isLoading={isCreatingUser}
                submitButtonLabel={"Create User"}
              />
            </Grid>
          </center>
        </Box>
      </Modal>
    </Grid>
  );
};

export default AdminUsersPage;
