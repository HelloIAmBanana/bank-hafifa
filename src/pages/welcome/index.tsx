<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";

function getAsyncData(key: string) {
  const myPromise: Promise<UserData> = new Promise((resolve) => {
    setTimeout(() => {
      const data = sessionStorage.getItem(key);
      resolve(data ? JSON.parse(data) : []);
    }, 1000);
  });
  return myPromise;
=======
import * as React from 'react';
import Box from '@mui/material/Box';

import NavBar from '../../components/navigationBar/navBar';
const navigationItems = [
  {
      role: "admin"
  }
]

export default function ClippedDrawer() {
  
 
  return (
    <Box>{NavBar()}</Box>
  );
>>>>>>> Stashed changes
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

const WelcomePage: React.FC = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getUsername = async () => {
      const usernameName = await getAsyncData("currentUser");
      usernameName.firstName == undefined?
      window.location.href = "/signin":
      setUsername("Welcome back, "+usernameName.role+" "+usernameName.firstName[0].toUpperCase()+usernameName.firstName.substring(1).toLowerCase()+" "+usernameName.lastName[0].toUpperCase()+usernameName.lastName.substring(1).toLowerCase());
    };

    getUsername();
  }, []);


  return <h1>{username}</h1>;
};
export default WelcomePage;
