import * as React from "react";
import Ajv, { JSONSchemaType } from "ajv";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import loginImage from "../../imgs/loginPage.svg";
import { useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import GenericForm from "../../components/GenericForm";
const ajv = new Ajv({ allErrors: true });

require("ajv-errors")(ajv);

function getAsyncData(key: string) {
  const myPromise: Promise<UserData[]> = new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem(key);
      resolve(data ? JSON.parse(data) : []);
    }, 1000);
  });
  return myPromise;
}
function getAsyncCurrentUser(key: string) {
  const myPromise: Promise<UserData> = new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem(key);
      resolve(data ? JSON.parse(data) : []);
    }, 1000);
  });
  return myPromise;
}

function setCurrentUser(key: string, value: UserData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      sessionStorage.setItem(key, JSON.stringify(value));
      resolve(value);
    }, 1000);
  });
}
function setRememberedUser(key: string, value: UserData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
      sessionStorage.setItem(key, JSON.stringify(value));
      resolve(value);
    }, 1000);
  });
}

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
    gender: { type: "string", enum: ["male", "female"] },
    accountType: { type: "string", enum: ["business", "personal"] },
    role: { type: "string", enum: ["admin", "customer"] },
  },
  required: ["email", "password"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      email: "Entered Email Is Invalid.",
      password: "Entered Password Is Invalid.",
    },
    _: 'data should have properties "foo" and "bar" only',
  },
};

const validate = ajv.compile(schema);
const SignInPage: React.FC = () => {
const [rememberMe, setRememberMe] = React.useState(false);


  const fields = [
    {
      id: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Enter your email",
      errorMsg: "Entered Email Is Invalid.",
      errorMsgVisibility: true,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Password",
      errorMsg: "Entered Password Is Invalid.",
      errorMsgVisibility: true,
    },
  ];

  useEffect(() => {
    const isUserRemembered = async () => {
      const usernameName = await getAsyncCurrentUser("currentUser");
      if (usernameName.firstName !== undefined) {
        await setCurrentUser("currentUser", usernameName).then(function () {
          window.location.href = "/welcome";
        });
      }
    };
    isUserRemembered();
  }, []);

  const loginCheck = async (data: Record<string, any>) => {
    const users = await getAsyncData("users"); //change to map
    let realUser: boolean = false;
    if (validate(data)) {
      for (let i = 0; i < users.length; i++) {
        const currentUser = users[i];
        if (
          currentUser.email.includes(`${data.email}`) &&
          currentUser.email.length == data.email.length
        ) {
          if (
            currentUser.password.includes(`${data.password}`) &&
            currentUser.password.length == data.password.length
          ) {
            console.log(currentUser);
            if (rememberMe) {
              await setRememberedUser("currentUser", currentUser);
            } else {
              await setCurrentUser("currentUser", currentUser);
            }
            realUser = true;
            window.location.href = "/welcome";
          }
        }
      }
    } else {
      alert("User Not Real");
    }
  };

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  return (
    <Grid container component="main" sx={{ height: "90vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={5}
        md={6}
        my={15}
        sx={{
          backgroundImage: `url(${loginImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "65%",
          borderRadius: "20px",
          backgroundPosition: "center",
        }}
      />
      <Grid
        item
        xs={4}
        sm={6}
        md={5}
        my={5}
        component={Paper}
        elevation={8}
        square={false}
        borderRadius={5}
      >
        <Box
          sx={{
            my: 4,
            mx: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        ></Box>

        <Grid container spacing={1}>
          {/*  */}
          <Grid item my={5} mx={25} lineHeight={50} spacing={54}>
            <h1 className="firstTitle" style={{ lineHeight: "1" }}>
              Welcome back
            </h1>
          </Grid>
          <Grid item ml={12} sm={12} my={-10} mx={0}>
            <h2 className="secondTitle">Please enter your details.</h2>
          </Grid>
          {/*  */}
          <Grid item ml={12} sm={12} my={5} mx={12}>
            <GenericForm
              fields={fields}
              customSubmitFunction={loginCheck}
              submitButtonName="Sign In"
              schema={schema}
            />
          </Grid>
          <Grid container justifyContent="flex-start">
            <Grid item mx={12} my={-4} className="existingUserButton">
              <Checkbox
                onChange={handleRememberMe}
                title="Remember me"
              ></Checkbox>
              Remember Me
            </Grid>
            <Grid item mx={17.8} my={-3}>
              <Link to="/" className="existingUserButton">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
          <Grid style={{ width: "30" }}></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignInPage;
