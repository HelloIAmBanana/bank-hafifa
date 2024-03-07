import * as React from "react";
import { useState } from "react";
import GenericForm from "../../components/GenericForm";
import Ajv, { JSONSchemaType } from "ajv";
import Grid from "@mui/material/Grid";
import { Box, Button } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import signupImage from "../../imgs/signupPage.svg";
import { User } from "../../components/models/user";
import ajvErrors from "ajv-errors";
import { useNavigate } from "react-router-dom";

function getAsyncData(key: string) {
  const myPromise: Promise<string> = new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem(key);
      resolve(data ? JSON.parse(data) : []);
    }, 1000);
  });
  return myPromise;
}

function setAsyncData(key: string, value: User[]) {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve(value);
    }, 1000);
  });
}

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

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
    avatarUrl: { type: "string", minLength: 1 },
    gender: { type: "string", enum: ["Male", "Female"] },
    accountType: { type: "string", enum: ["Business", "Personal"] },
    role: { type: "string", enum: ["admin", "customer"] },
    balance: { type: "integer" },
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
  errorMessage: {
    properties: {
      email: "Entered Email Is Invalid.",
      password: "Entered Password Is Invalid.",
    },
  },
};

const validate = ajv.compile(schema);

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [avatarImgURL, setAvatarImgURL] = useState(
    "https://static.thenounproject.com/png/765938-200.png"
  );
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
      id: generateUniqueId(),
      role: "customer",
      email: data.email.toLowerCase(),
      avatarUrl:
        avatarImgURL === "https://static.thenounproject.com/png/765938-200.png"
          ? "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-26.jpg"
          : avatarImgURL,
      balance: 0,
    };
    if (validate(newUser)) {
      const users = await getAsyncData("users");
      const updatedUsers = Array.isArray(users) ? [...users, newUser] : [newUser];
      await setAsyncData("users", updatedUsers);
      navigate("/signin");
    }
  };

  return (
    <div
    >
      <Grid container component="main" sx={{ height: "100%" }}>
        <CssBaseline />
        <Grid
          item
          md={6}
          sx={{
            backgroundImage: `url(${signupImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100%",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          md={5}
          component={Paper}
          elevation={12}
          square={false}
          borderRadius={5}
        >
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={1}>
              <Grid item ml={12} my={2}>
                <h1 className="firstTitle">CREATE ACCOUNT</h1>
              </Grid>
              <Grid item ml={12} sm={12} my={-6}>
                <h2 className="secondTitle">
                  Welcome! Please fill out the details below
                </h2>
              </Grid>
              <Grid item mx={42} my={4} style={{ textAlign: "center" }}>
                <Button
                  style={{
                    fontSize: "2rem",
                    padding: "50px",
                    borderRadius: "100%",
                    backgroundColor: "#F1F1F1",
                    backgroundSize: "100%",
                    backgroundImage: `url(${avatarImgURL})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                  component="label"
                >
                  <input
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
              </Grid>
              <Grid item xl={12} my={-6} mx={35}>
                <h4 className="addAvatarText">Upload profile image</h4>
              </Grid>
              {/*  */}

              <Grid item ml={5} sm={2} mx={6} my={3}></Grid>
              <Grid item xs={8} sm={6} my={5} mx={-3}>
                <GenericForm
                  fields={fields}
                  customSubmitAction={signUp}
                  submitButtonName="Sign Up"
                  schema={schema}
                />
              </Grid>
              <Grid container justifyContent="flex-start">
                <Grid item mx={7}>
                  <Link to="/signin" className="existingUserButton">
                    Already got a user?
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignUpPage;
