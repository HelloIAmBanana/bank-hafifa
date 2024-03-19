import * as React from "react";
import { useState } from "react";
import GenericForm from "../../components/GenericForm";
import Ajv, { JSONSchemaType } from "ajv";
import Grid from "@mui/material/Grid";
import { Box, Button, Input, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import signupImage from "../../imgs/signupPage.svg";
import { User } from "../../components/models/user";
import ajvErrors from "ajv-errors";
import { useNavigate } from "react-router-dom";
import CRUDLocalStorage from "../../components/CRUDLocalStorage";
import { generateUniqueId } from "../../utils/utils";
import { useRememberedUser } from "../../hooks/useRememberedUser";
import "./signup.css";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const fields = [
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
  {
    id: "email",
    label: "Email",
    type: "text",
    required: false,
    placeholder: "Enter your email",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    required: false,
    placeholder: "Password",
  },
  {
    id: "birthDate",
    label: "Date Of Birth",
    type: "date",
    required: false,
    placeholder: "Enter your birthday",
  },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    required: true,
    placeholder: "Enter your gender",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
  },
  {
    id: "accountType",
    label: "Account Type",
    type: "select",
    placeholder: "Enter your Account Type",
    required: true,
    options: [
      { value: "Personal", label: "Personal" },
      { value: "Business", label: "Business" },
    ],
  },
];

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
    gender: { type: "string", enum: ["Male", "Female"] },
    accountType: { type: "string", enum: ["Business", "Personal"] },
    role: { type: "string", enum: ["admin", "customer"] },
    balance: { type: "number" },
  },
  required: ["id", "birthDate", "email", "firstName", "lastName", "password"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      email: "Entered Email Is Invalid.",
      password: "Entered Password Is Invalid.",
      firstName: "Enter Your First Name",
      lastName: "Enter Your Last Name",
      birthDate: "Enter Your Birthdate",
    },
  },
};

const validateForm = ajv.compile(schema);

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  useRememberedUser()
  const [avatarImgURL, setAvatarImgURL] = useState<string | undefined>(undefined);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl: string = URL.createObjectURL(file);
      setAvatarImgURL(imageUrl);
    }
  };

  const signUp = async (data: Partial<any>) => {
    const newUser = {
      ...data,
      id: generateUniqueId(),
      role: "customer",
      email: data.email?.toLowerCase(),
      avatarUrl: avatarImgURL,
      balance: 0,
    };
    if (validateForm(newUser)) {
      const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
      const updatedUsers = [...users, newUser];
      await CRUDLocalStorage.setAsyncData("users", updatedUsers);
      navigate("/signin");
    }
  };

  return (
    <Grid container component="main" my={-7}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage: `url(${signupImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
          backgroundPosition: "bottom center",
        }}
      />
      <Grid
        item
        xs={12}
        md={6}
        component={Paper}
        elevation={20}
        borderRadius={3}
      >
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={1}>
            <Grid item margin={"auto"}>
              <Typography variant="h2" className="mainTitle">
                CREATE ACCOUNT
              </Typography>
              <Typography variant="h4" className="secondaryTitle">
                Welcome! Please fill out the details below
              </Typography>
            </Grid>
            <Grid item mx="auto" textAlign="center">
              <Button
                style={{
                  padding: "50px",
                  borderRadius: "100%",
                  backgroundSize: "100%",
                  backgroundImage: `url(${
                    avatarImgURL
                      ? avatarImgURL
                      : "https://static.thenounproject.com/png/765938-200.png"
                  })`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                component="label"
              >
                <Input
                  type="file"
                  onChange={handleImageUpload}
                  required
                  style={{
                    clip: "rect(0 0 0 0)",
                    clipPath: "inset(50%)",
                    height: 1,
                    overflow: "hidden",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    whiteSpace: "nowrap",
                    width: 1,
                  }}
                />
              </Button>
              <h4 className="addAvatarText">Upload profile image</h4>
              <GenericForm
                fields={fields}
                onSubmit={signUp}
                submitButtonLabel="Sign Up"
                schema={schema}
              />
            </Grid>
          </Grid>
          <Link to="/signin" className="existingUserButton">
            Already got a user?
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUpPage;
