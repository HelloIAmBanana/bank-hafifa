import * as React from "react";
import { useState } from "react";
import GenericForm from "../../components/GenericForm";
import Ajv, { JSONSchemaType } from "ajv";
import Grid from "@mui/material/Grid";
import { Box, Button, Input, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import signupImage from "../../imgs/signupPage.svg";
import { User } from "../../components/models/user";
import { useNavigate } from "react-router-dom";
import CRUDLocalStorage from "../../components/CRUDLocalStorage";
import AppUtilities from "../../components/utils";
const ajv = new Ajv({ allErrors: true, $data: true });

const fields = [
  {
    id: "firstName",
    label: "First Name",
    type: "text",
    required: false,
    placeholder: "Enter your first name",
    errorMsg: "Entered First Name Is Invalid.",
    errorMsgVisibility: true,
  },
  {
    id: "lastName",
    label: "Last Name",
    type: "text",
    required: false,
    placeholder: "Enter your last name",
    errorMsg: "Entered Last Name Is Invalid.",
    errorMsgVisibility: true,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    required: false,
    placeholder: "Enter your email",
    errorMsg: "Entered Email Is Invalid.",
    errorMsgVisibility: true,
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    required: false,
    placeholder: "Password",
    errorMsg: "Entered Password Is Invalid.",
    errorMsgVisibility: true,
  },
  {
    id: "birthDate",
    label: "Date Of Birth",
    type: "date",
    required: false,
    placeholder: "Enter your birthday",
    errorMsg: "Entered Date Is Invalid.",
    errorMsgVisibility: true,
  },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    required: true,
    placeholder: "Enter your gender",
    errorMsg: "Entered Gender Is Invalid.",
    errorMsgVisibility: true,
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
    errorMsg: "Entered Account Type Is Invalid.",
    errorMsgVisibility: true,
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
  required: [
    "id",
    "accountType",
    "birthDate",
    "email",
    "firstName",
    "gender",
    "lastName",
    "password",
    "avatarUrl",
  ],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [avatarImgURL, setAvatarImgURL] = useState<string | undefined>(undefined);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl: string = URL.createObjectURL(file);
      console.log("Uploaded image URL:", imageUrl);
      setAvatarImgURL(imageUrl);
    }
  };

  const signUp = async (data: Partial<any>) => {
    const newUser = {
      ...data,
      id: AppUtilities.generateUniqueId(),
      role: "customer",
      email: data.email.toLowerCase(),
      avatarUrl: avatarImgURL,
      balance: 0,
    };
    if (validate(newUser)) {
      const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
      const updatedUsers = Array.isArray(users) ? [...users, newUser] : [newUser];
      await CRUDLocalStorage.setAsyncData("users", updatedUsers);
      navigate("/signin");
    }
  };

  return (
    <div>
      <Grid container component="main" sx={{ height: "100%" }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          md={6}
          my={4.8}
          sx={{
            backgroundImage: `url(${signupImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "120%",
            backgroundPosition: "bottom left",
          }}
        />
        <Grid
          item
          xs={12}
          md={6}
          component={Paper}
          elevation={8}
          square={false}
          borderRadius={5}
        >
          <Box
            sx={{
              my: 7,
              mx: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></Box>

          <Box sx={{ mt: 1 }}>
            <Grid container spacing={1}>
              <Grid item ml={12} my={2}>
                <Typography variant="h2" className={"firstTitle"}>
                  CREATE ACCOUNT
                </Typography>
              </Grid>
              <Grid item ml={12} sm={12} my={0}>
                <h2 className="secondTitle">
                  Welcome! Please fill out the details below
                </h2>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                my={4}
                mx="auto"
                textAlign="center"
              >
                {" "}
                <Button
                  style={{
                    fontSize: "2rem",
                    padding: "50px",
                    borderRadius: "100%",
                    backgroundColor: "#F1F1F1",
                    backgroundSize: "100%",
                    backgroundImage: `url(${avatarImgURL?avatarImgURL:"https://static.thenounproject.com/png/765938-200.png"})`,
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
                  customSubmitFunction={signUp}
                  submitButtonName="Sign Up"
                  schema={schema}
                />
                <Link to="/signin" className="existingUserButton">
                  Already got a user?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignUpPage;
