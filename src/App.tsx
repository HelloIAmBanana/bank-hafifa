import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from "react-dom";
import SignUpPage from "./pages/signup";
import './style.css';
import SignInPage from "./pages/signin";
import WelcomePage from "./pages/welcome";
import ProfileSettingsPage from "./pages/profileSettings";

function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/home" element={<WelcomePage />} />
        <Route path="/loans" element={<WelcomePage />} />
        <Route path="/cards" element={<WelcomePage />} />
        <Route path="/deposits" element={<WelcomePage />} />
        <Route path="/account" element={<ProfileSettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
ReactDOM.render(<App/>, document.getElementById("root"));
