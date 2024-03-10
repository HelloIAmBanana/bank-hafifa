import * as React from "react";
import { useState} from "react";
import GenericForm from "../../components/GenericForm";
import Ajv, { JSONSchemaType } from "ajv";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import signupImage from "../../imgs/signupPage.svg";

function getAsyncData(key: string) {
  const myPromise: Promise<string> = new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem(key);
      resolve(data ? JSON.parse(data) : []);
    }, 1000);
  });
  return myPromise;
}

function setAsyncData(key: string, value: UserData[]) {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve(value);
    }, 1000);
  });
}

const ajv = new Ajv({ allErrors: true, $data: true });

const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substring(2, 9);
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
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  hobbies: string[];
  email: string;
  password: string;
  avatarUrl: string;
  gender: string;
  accountType: string;
  role: string;
};

const schema: JSONSchemaType<UserData> = {
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
  const [avatarImgURL, setAvatarImgURL] = useState("");
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl: string = URL.createObjectURL(file);
      console.log("Uploaded image URL:", imageUrl);
      setAvatarImgURL(imageUrl);
    }
  };
  const signUpFunction = async (data: Record<string, string>) => {
    data.id = generateUniqueId();
    data.role = "customer";
    data.email = data.email.toLowerCase();
    data.avatarUrl = avatarImgURL;
    if (validate(data)) {
      const users = await getAsyncData("users");
      const updatedUsers = Array.isArray(users)
        ? [...users, newUser]
        : [newUser];
      await setAsyncData("users", updatedUsers);
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
              <Typography variant="h2" className={"firstTitle"} >CREATE ACCOUNT</Typography>
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
                {/* Added Grid item properties */}
                <Button
                  style={{
                    fontSize: "2rem",
                    padding: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#F1F1F1",
                  }}
                  component="label"
                >
                  <AddAPhotoIcon sx={{ color: "#212121" }} />
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleImageUpload}
                    required
                  />
                </Button>
                <h4 className="addAvatarText">Upload profile image</h4>
                <GenericForm
                  fields={fields}
                  customSubmitFunction={signUpFunction}
                  submitButtonName="Sign In"
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
