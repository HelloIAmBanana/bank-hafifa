import React, { useState } from "react";
import loginImage from "../../imgs/loginPage.svg";
import GenericForm from "../../components/GenericForm/GenericForm";
import { User } from "../../models/user";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { validateLogin } from "./login";
import { Typography, Box, Grid, Paper} from "@mui/material";
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
    currency: { type: "string" },

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



function successfulSignIn(userID: string, rememberMe: boolean) {
  if (rememberMe) {
    localStorage.setItem("rememberedAuthToken", userID);
  } else {
    sessionStorage.setItem("currentAuthToken", userID);
  }
  successAlert("Signing in!");
}

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;

  const [isSigningIn, setIsSigningIn] = useState(false);

  const login = async (data: Record<string, any>) => {
    setIsSigningIn(true);
    const validUser = await validateLogin(data.email, data.password);

    if (!validUser) {
      errorAlert("Wrong Credentials!");
      setIsSigningIn(false);
      return;
    }

    successfulSignIn(validUser.id, data.rememberMe);
    navigate("/home");
  };

  document.title = "Sign In";

  const fields = [
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      initValue: state.email?state.email:""
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",

    },
    {
      id: "rememberMe",
      label: "Remember Me",
      type: "checkbox",
    },
  ];

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
                isLoading={isSigningIn}
              />
            </Grid>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <Grid item>
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
              <Grid item>
                <NavLink
                  to="/forgot-password"
                  style={{
                    padding: "20px",
                    textDecoration: "none",
                    fontFamily: "Poppins",
                    color: "#181818",
                    fontSize: "18px",
                    marginTop: "25px",
                  }}
                >
                  Forgot Your Password?
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
