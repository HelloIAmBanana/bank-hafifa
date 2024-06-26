import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import GenericForm from "../../components/GenericForm/GenericForm";
import { Box, Button, Input, Typography, Grid, Paper } from "@mui/material";
import signupImage from "../../imgs/signupPage.svg";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { doesUserExist, generateUniqueId } from "../../utils/utils";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { User } from "../../models/user";
import { JSONSchemaType } from "ajv";

const fields = [
  {
    id: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
  },
  {
    id: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
  },
  {
    id: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter your email",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
  },
  {
    id: "birthDate",
    label: "Date Of Birth",
    type: "date",
    placeholder: "Enter your birthday",
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

const SignUpPage: React.FC = () => {
  const [avatarImgURL, setAvatarImgURL] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl: string = URL.createObjectURL(file);
      setAvatarImgURL(imageUrl);
    }
  };

  

  const signUp = async (data: any) => {
    const newUser: User = {
      ...data,
      id: generateUniqueId(),
      role: "customer",
      email: data.email.toLowerCase(),
      avatarUrl: avatarImgURL,
      balance: 0,
    };
      setIsLoading(true);

      const isDuplicatedUser = await doesUserExist(newUser.email);

      if (isDuplicatedUser) {
        errorAlert("User already exists!");
        setIsLoading(false);
        return;
      }

      await CRUDLocalStorage.addItemToList<User>("users", newUser);
      successAlert("Account Created! Navigating to Signin Page...");
      navigate("/");
  };

  document.title = "Sign Up";

  return (
    <Grid container component="main">
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
      <Grid item xs={2} md={6} component={Paper} elevation={20} borderRadius={3}>
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={1}>
            <Grid item mx="auto" textAlign="center">
              <Grid item margin={"auto"}>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "50px",
                    fontWeight: "bold",
                    lineHeight: "50px",
                  }}
                >
                  CREATE ACCOUNT
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "25px",
                    lineHeight: "50px",
                    textAlign: "center",
                  }}
                >
                  Welcome! Please fill out the details below
                </Typography>
              </Grid>
              <Button
                style={{
                  padding: "50px",
                  border: "1px solid black",
                  borderRadius: "100%",
                  backgroundSize: "100%",
                  backgroundImage: `url(${
                    avatarImgURL ? avatarImgURL : "https://static.thenounproject.com/png/765938-200.png"
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

              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "18px",
                  lineHeight: "50px",
                  textAlign: "center",
                }}
              >
                Upload profile image
              </Typography>
              <GenericForm
                fields={fields}
                onSubmit={signUp}
                submitButtonLabel="Sign Up"
                schema={schema}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>
          <NavLink
            to="/"
            style={{
              padding: "20px",
              textDecoration: "none",
              fontFamily: "Poppins",
              color: "#181818",
              fontSize: "18px",
              marginLeft: 10,
            }}
          >
            Already got a user?
          </NavLink>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUpPage;
