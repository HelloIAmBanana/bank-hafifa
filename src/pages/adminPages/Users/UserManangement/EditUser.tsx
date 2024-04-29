import { JSONSchemaType } from "ajv";
import { User } from "../../../../models/user";
import { Grid, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import GenericForm from "../../../../components/GenericForm/GenericForm";
import { userFields } from "./UserFields";

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  isLoading: boolean;
  updateProfile: (data: any) => Promise<void>;
  closeModal: () => void;
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
      firstName: "Enter First Name",
      lastName: "Enter Last Name",
      birthDate: "Enter Birthdate",
      gender: "Please Select Gender",
      accountType: "Please Select Account Type",
      role: "Please Select Account Role",
    },
  },
};
const EditUserModal: React.FC<EditUserModalProps> = ({ user, isLoading, isOpen, updateProfile, closeModal }) => {
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 5,
          paddingLeft: 5,
          paddingRight: 5,
          overflowY: "auto",
        }}
      >
        <center>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "Poppins", color: "black", fontWeight: "bold" }}>
            Edit User
          </Typography>
          <Grid item mx="auto">
            <GenericForm
              fields={userFields(user)}
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
