import * as React from "react";
import Ajv, { JSONSchemaType } from "ajv";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import loginImage from "../../imgs/loginPage.svg";
import GenericForm from "../../components/GenericForm";
import ajvErrors from "ajv-errors";
import { User } from "../../components/models/user";
import { useNavigate } from "react-router-dom";
import AuthService from "../../components/AuthService";
import {validateLogin} from "./login";
import { Typography } from "@mui/material";
import Swal from "sweetalert2";
import { useRememberedUser } from "../../hooks/useRememberedUser";

import "./login.css";

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
    gender: { type: "string", enum: ["male", "female"] },
    accountType: { type: "string", enum: ["business", "personal"] },
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

const validateForm = ajv.compile(schema);

const SignInPage: React.FC = () => {
  const navigate = useNavigate();

  const fields = [
    {
      id: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Enter your email",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Password",
    },
    {
      id: "rememberMe", 
      label: "Remember Me",
      type: "checkbox", 
      required: false,
    },
  ];

  useRememberedUser()

  const login = async (data: Record<string, any>) => {
    if (validateForm(data)) {
      type UserAndRemembered= User & {rememberMe:Boolean}
      const validUser = await validateLogin(data as UserAndRemembered);
      console.log("Heysfadsdfa"+validUser);
      if (validUser) {
        AuthService.storeUserToStorage(validUser);
        console.log(validUser);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          color: "green",
          title: "Signing In!",
          showConfirmButton: false,
          timer: 3750,
          timerProgressBar: true,
        });
        navigate("/home");
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          color: "red",
          title: "Wrong Credentials!",
          showConfirmButton: false,
          timer: 3750,
          timerProgressBar: true,
        });
      }
    }
  };

  return (
    <Grid container component="main" sx={{ height: "85vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage: `url(${loginImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
          borderRadius: "20px",
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
        <Box sx={{ mt: 25 }}>
          <Grid container spacing={1}>
            <Grid item margin={"auto"}>
              <Typography variant="h2" className="mainTitle">
                Welcome back
              </Typography>
              <Typography variant="h4" className="secondaryTitle">
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
            />

          </Grid>
          <Grid container justifyContent="flex-start">
            <Grid item sx={{ marginLeft: "auto" }}>
              <Link to="/" className="forgotPasswordButton">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignInPage;
