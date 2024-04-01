import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import SignUpPage from "./pages/signup";
import "./style.css";
import SignInPage from "./pages/signin";
import WelcomePage from "./pages/welcome";
import "./fonts/Poppins-Regular.ttf";
import { AuthHandlerRoute } from "./ProtectedRoutes";
import ProfileSettingsPage from "./pages/profileSettings";
import LoansPage from "./pages/loans";
import DepositsPage from "./pages/deposits";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route element={<AuthHandlerRoute />}>
            <Route path="/" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<WelcomePage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/cards" element={<WelcomePage />} />
            <Route path="/deposits" element={<DepositsPage />} />
            <Route path="/account" element={<ProfileSettingsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
ReactDOM.render(<App />, document.getElementById("root"));
