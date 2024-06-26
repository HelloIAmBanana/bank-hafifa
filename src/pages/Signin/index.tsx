import React, { useState } from "react";
import loginImage from "../../imgs/loginPage.svg";
import GenericForm from "../../components/GenericForm/GenericForm";
import { User } from "../../models/user";
import { useNavigate, NavLink } from "react-router-dom";
import { validateLogin } from "./login";
import { Typography, Box, Grid, Paper } from "@mui/material";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { JSONSchemaType } from "ajv";

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
    gender: { type: "string", enum: ["Male", "Female"] },
    accountType: { type: "string", enum: ["Business", "Personal"] },
    role: { type: "string", enum: ["admin", "customer"] },
    balance: { type: "number" },
  },
  required: ["email", "password"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      email: "Entered Email Is Invalid.",
      password: "Entered Password Is Invalid.",
    },
  },
};

const fields = [
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
  },
  {
    id: "rememberMe",
    label: "Remember Me",
    type: "checkbox",
  },
];

function storeCurrentAuthToken(userID: string, rememberMe: boolean) {
  if (rememberMe) {
    localStorage.setItem("rememberedAuthToken", userID);
  } else {
    sessionStorage.setItem("currentAuthToken", userID);
  }
}

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: Record<string, any>) => {
      setIsLoading(true);

      const validUser = await validateLogin(data.email,data.password);

      if (!validUser) {
        errorAlert("Wrong Credentials!");
        setIsLoading(false);
        return;
      }
      
      storeCurrentAuthToken(validUser.id, data.rememberMe);
      successAlert("Signing in!");
      navigate("/home");
  };

  document.title = "Sign In";

  return (
    <Box sx={{ display: "flex", backgroundColor: "white" }}>
      <Grid container component="main" sx={{ height: "95vh" }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundImage: `url(${loginImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100%",
            borderRadius: "20px",
          }}
        />
        <Grid item xs={12} md={6} component={Paper} elevation={20} borderRadius={3}>
          <Box sx={{ mt: 25 }}>
            <Grid container spacing={1}>
              <Grid item margin={"auto"}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "50px",
                    fontWeight: "bold",
                    lineHeight: "50px",
                    textAlign: "center",
                  }}
                >
                  Welcome back
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontFamily: "Poppins", fontSize: "25px", lineHeight: "50px", textAlign: "center" }}
                >
                  Please enter your details.
                </Typography>
              </Grid>
            </Grid>
            <Grid item mx="auto" textAlign="center" mt={7}>
              <GenericForm
                fields={fields}
                onSubmit={login}
                submitButtonLabel="Sign In"
                schema={schema}
                isLoading={isLoading}
              />
            </Grid>
            <Grid container justifyContent="flex-start">
              <Grid
                item
                sx={{
                  marginLeft: "auto",
                  fontFamily: "Poppins",
                  textDecoration: "none",
                }}
              >
                <NavLink
                  to="/signup"
                  style={{
                    padding: "20px",
                    textDecoration: "none",
                    fontFamily: "Poppins",
                    color: "#181818",
                    fontSize: "18px",
                  }}
                >
                  First time? Join us here!
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignInPage;
