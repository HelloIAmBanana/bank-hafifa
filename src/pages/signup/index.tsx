import React, { useState } from "react";
import { NavLink, NavigateFunction, useNavigate } from "react-router-dom";
import GenericForm from "../../components/GenericForm/GenericForm";
import { Box, Button, Input, Typography, Grid, Paper } from "@mui/material";
import signupImage from "../../imgs/signupPage.svg";
import { doesUserExist, generateUniqueId } from "../../utils/utils";
import { errorAlert } from "../../utils/swalAlerts";
import { User } from "../../models/user";
import { JSONSchemaType } from "ajv";
import signupFormFields from "./signupFormFields";
import { getUserFullName } from "../../utils/utils";
import emailjs from "emailjs-com";
import openVerifyEmailModal from "./openVerifyEmailModal";

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
    role: { type: "string", enum: ["admin", "customer"] },
    balance: { type: "number" },
    currency: { type: "string" },
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

async function sendVerificationEmail(user: User,navigate: NavigateFunction) {
  return emailjs.send(
    "MoleculeBankEmailService",
    "VerifyEmailTemplate",
    {
      to_name: getUserFullName(user),
      verifyCode: user.id.slice(1),
      email: user.email,
    },
    "mV0Sbuwnyfajg2kGj"
  ).then(
    async () => {
      await openVerifyEmailModal(user, navigate);
    },
    (error) => {
      console.log('FAILED...', error.text);
      errorAlert("Failed to send email");

    },);
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
      currency: "USD",
    };
    setIsLoading(true);

    const isDuplicatedUser = Boolean(await doesUserExist(newUser.email));

    if (isDuplicatedUser) {
      errorAlert("User already exists!");
      setIsLoading(false);
      return;
    }

    await sendVerificationEmail(newUser,navigate);
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
        <Box sx={{ mt: 4 }}>
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
                fields={signupFormFields}
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
