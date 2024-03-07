import * as React from "react";
import Ajv, { JSONSchemaType } from "ajv";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import loginImage from "../../imgs/loginPage.svg";
import { useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import GenericForm from "../../components/GenericForm";
import ajvErrors from "ajv-errors";
import { User } from "../../components/models/user";
import { useNavigate } from "react-router-dom";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);
function getAsyncData(key: string) {
  const myPromise: Promise<User[]> = new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem(key);
      resolve(data ? JSON.parse(data) : []);
    }, 1000);
  });
  return myPromise;
}
function getCurrentUser(key: string) {
  const data = localStorage.getItem(key);
  const currentUser = data ? JSON.parse(data) : [];
  return currentUser;
}

function setCurrentUser(key: string, value: User) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

function setRememberedUser(key: string, value: User) {
  localStorage.setItem(key, JSON.stringify(value));
  sessionStorage.setItem(key, JSON.stringify(value));
}

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
  additionalProperties: false,
  errorMessage: {
    properties: {
      lastName: "Entfasdered Email Is Invalid.",
      firstName: "Entered Password Is Invalid.",
    },
  },
};

const validate = ajv.compile(schema);

const SignInPage: React.FC = () => {
  const navigate = useNavigate();

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
    const isUserRemembered = () => {
      const usernameName = getCurrentUser("currentUser");
      if (usernameName.firstName !== undefined) {
        setCurrentUser("currentUser", usernameName);
        navigate("/welcome");
      }
    };
    isUserRemembered();
  });

  const loginCheck = async (data: Record<string, any>) => {
    const users = await getAsyncData("users");
    if (validate(data)) {
      users.map((currentUser) => {
        if (
          currentUser.email.includes(`${data.email}`) &&
          currentUser.email.length === data.email.length
        ) {
          if (
            currentUser.password.includes(`${data.password}`) &&
            currentUser.password.length === data.password.length
          ) {
            console.log(currentUser);
            if (rememberMe) {
              setRememberedUser("currentUser", currentUser);
            } else {
              setCurrentUser("currentUser", currentUser);
            }
            navigate("/welcome");
          }
        }
      });
      alert("User Not Real");
    }
  };

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  return (
    <Grid container component="main" sx={{ height: "90vh", display: "flex" }}>
      <CssBaseline />
      <Grid
        item
        md={6}
        sx={{
          backgroundImage: `url(${loginImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
          backgroundPosition: "center",
        }}
      />
      <Grid item md={5} component={Paper} elevation={15} borderRadius={15}>
        <Grid container spacing={1}>
          <Grid item my={5} mx={25} lineHeight={50} spacing={54}>
            <h1 className="firstTitle" style={{ lineHeight: "1" }}>
              Welcome back
            </h1>
          </Grid>
          <Grid item ml={12} sm={12} my={-10} mx={0}>
            <h2 className="secondTitle">Please enter your details.</h2>
          </Grid>
          <Grid item ml={12} sm={12} my={5} mx={12}>
            <GenericForm
              fields={fields}
              customSubmitAction={loginCheck}
              submitButtonName="Sign In"
              schema={schema}
            />
          </Grid>
          <Grid container>
            <Grid item my={-4} className="existingUserButton">
              <Checkbox
                onChange={handleRememberMe}
                title="Remember me"
              ></Checkbox>
              Remember Me
            </Grid>
            <Grid item my={-3}>
              <Link to="/" className="existingUserButton">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignInPage;
