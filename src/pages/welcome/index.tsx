import * as React from 'react';
import Box from '@mui/material/Box';

import NavBar from '../../components/navigationBar/navBar';
const navigationItems = [
  {
      role: "admin"
  }
]


const WelcomePage: React.FC = () => {


  return (
    <Box>{NavBar()}</Box>
  );
};
export default WelcomePage;
