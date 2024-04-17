import { JSONSchemaType } from "ajv";
import { User } from "../../models/user";
import { Grid, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import GenericForm from "../GenericForm/GenericForm";

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  isLoading: boolean;
  updateProfile: (data:any) => Promise<void>;
  closeModal:()=>void;
}

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
    accountType: { type: "string", enum: ["Business", "Personal"] },
    role: { type: "string", enum: ["admin", "customer"] },
    balance: { type: "number" },
  },
  required: ["birthDate", "email", "firstName", "lastName", "password", "gender", "accountType"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      email: "Entered Email Is Invalid.",
      password: "Entered Password Is Less Than 6 Characters.",
      firstName: "Enter Your First Name",
      lastName: "Enter Your Last Name",
      birthDate: "Enter Your Birthdate",
      gender: "Please Select Your Gender",
      accountType: "Please Select Your Account Type",
    },
  },
};
const EditUserModal: React.FC<EditUserModalProps> = ({ user,isLoading,isOpen,updateProfile,closeModal}) => {
  const fields = [
    {
      id: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
      initValue: `${user.firstName}`,
    },
    {
      id: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
      initValue: `${user.lastName}`,
    },
    {
      id: "email",
      label: "Email",
      type: "text",
      placeholder: "Enter email",
      initValue: `${user.email}`,
    },
    {
      id: "password",
      label: "Password",
      type: "text",
      placeholder: "Enter Password",
      initValue: `${user.password}`,
    },
    {
      id: "birthDate",
      label: "Date Of Birth",
      type: "date",
      placeholder: "Enter birthday",
      initValue: `${user.birthDate}`,
    },
    {
      id: "gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
      initValue: `${user.gender}`,
    },
    {
      id: "accountType",
      label: "Account Type",
      type: "select",
      options: [
        { value: "Personal", label: "Personal" },
        { value: "Business", label: "Business" },
      ],
      initValue: `${user.accountType}`,
    },
    {
      id: "role",
      label: "Account Role",
      type: "select",
      options: [
        { value: "admin", label: "Admin" },
        { value: "customer", label: "Customer" },
      ],
      initValue: `${user.role}`,
    },
    {
      id: "balance",
      label: "Balance",
      type: "number",
      initValue: `${user.balance}`,

    },
    {
      id: "avatarUrl",
      label: "Profile Picture",
      type: "file",
    },
  ];
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 360,
          bgcolor: "white",
          borderRadius: 5,
          paddingLeft:5,
          paddingRight:5,
        }}
      >
        <center>
        <Typography variant="h6" gutterBottom sx={{ fontFamily: "Poppins", color: "black", fontWeight:"bold" }}>
          Edit User
        </Typography>
        <Grid item mx="auto">
          <GenericForm
            fields={fields}
            onSubmit={updateProfile}
            schema={schema}
            isLoading={isLoading}
            submitButtonLabel={"Save User"}
          />
        </Grid>
        </center>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
