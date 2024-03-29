import * as React from "react";
import { useState, useEffect } from "react";
import AuthService from "../../AuthService";
import { User } from "../../models/user";
import { Box } from "@mui/material";

const WelcomePage: React.FC = () => {
  const [timeGreetings, setTimeGreetings] = useState("");
  const [fullName, setFullName] = useState("");

  const time = new Date().getHours();
  useEffect(() => {
    if (time < 12 && time > 6) {
      setTimeGreetings("Good morning, ");
    } else if (time < 18 && time > 12) {
      setTimeGreetings("Good afternoon, ");
    } else if (time < 24 && time > 18) {
      setTimeGreetings("Good evening, ");
    } else if (time < 6 && time > 24) {
      setTimeGreetings("Good night, ");
    }
  }, [time]);
  async function getFullName() {
    const user = (await AuthService.getUserFromStorage(
      AuthService.getAuthToken() as string
    )) as User;
    console.log(user);
    setFullName(
      user.firstName[0].toUpperCase() +
        user.firstName.substring(1).toLowerCase() +
        " " +
        user.lastName[0].toUpperCase() +
        user.lastName.substring(1).toLowerCase()
    );
  }

  getFullName();
  return (
    <Box>
      {timeGreetings} {fullName}
    </Box>
  );
};
export default WelcomePage;
