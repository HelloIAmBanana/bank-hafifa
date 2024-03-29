import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import SignUpPage from "./pages/signup";
import "./style.css";
import SignInPage from "./pages/signin";
import WelcomePage from "./pages/welcome";
import "./fonts/Poppins-Regular.ttf";
import { ProtectedRoutes } from "./ProtectedRoutes";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/welcome" element={<WelcomePage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
ReactDOM.render(<App />, document.getElementById("root"));
