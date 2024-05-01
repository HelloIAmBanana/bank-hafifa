import React, { useState } from "react";
import { User } from "../../models/user";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { Grid, Typography } from "@mui/material";
import GenericForm from "../../components/GenericForm/GenericForm";
import { JSONSchemaType } from "ajv";
import emailjs from "emailjs-com";
import { doesUserExist, getUserFullName } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

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
    currency: { type: "string" },

  },
  required: ["email"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      email: "Entered Email Is Invalid",
    },
  },
};

const fields = [
  {
    id: "email",
    type: "email",
    placeholder: "Enter Your Email",
  },
];

const ForgotPasswordPage: React.FC = () => {
  const [isSendingPassword, setIsSendingPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendPassword = async (data: any) => {
    setIsSendingPassword(true);
    const enteredEmail = data.email.toLowerCase();

    const user = await doesUserExist(enteredEmail);

    if (!user) {
      errorAlert("This email isn't registerd!");
      setIsSendingPassword(false);
      return;
    }

    emailjs.send(
      "MoleculeBankEmailService",
      "ForgotPasswordTemplate",
      {
        to_name: getUserFullName(user),
        password: user.password,
        email: enteredEmail,
      },
      "mV0Sbuwnyfajg2kGj"
    );

    successAlert(`Email sent to ${enteredEmail}`);
    navigate("/");
  };

  document.title = "Forgot Password";

  return (
    <Grid container direction="column" justifyContent="flex-start" alignItems="center" marginTop={5} mr={15}>
      <center>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "Poppins",
            fontSize: "50px",
            fontWeight: "bold",
            lineHeight: "50px",
            textAlign: "center",
            mb: 5,
          }}
        >
          Please enter your registerd email
        </Typography>
        <GenericForm
          fields={fields}
          onSubmit={handleSendPassword}
          submitButtonLabel="Send Password"
          schema={schema}
          isLoading={isSendingPassword}
        />
      </center>
      <NavLink
        to="/"
        style={{
          padding: "20px",
          textDecoration: "none",
          fontFamily: "Poppins",
          color: "Highlight",
          fontSize: "18px",
          marginTop: "25px",
        }}
      >
        Remembered Your Password? Sign In Here!
      </NavLink>
      <NavLink
        to="/signup"
        style={{
          padding: "20px",
          textDecoration: "none",
          fontFamily: "Poppins",
          color: "Highlight",
          fontSize: "18px",
          marginTop: "15px",
        }}
      >
        Create Account Here!
      </NavLink>
    </Grid>
  );
};

export default ForgotPasswordPage;
