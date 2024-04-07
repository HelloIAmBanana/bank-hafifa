import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import SignUpPage from "./pages/signup";
import SignInPage from "./pages/signin";
import { AuthHandlerRoute } from "./ProtectedRoutes";
import ProfileSettingsPage from "./pages/profileSettings";
import LoansPage from "./pages/loans";
import DepositsPage from "./pages/deposits";
import Welcome from "./pages/welcomePage";
import "./fonts/Poppins-Regular.ttf";
import "./style.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route element={<AuthHandlerRoute />}>
            <Route path="/" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<Welcome />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/cards" element={<Welcome />} />
            <Route path="/deposits" element={<DepositsPage />} />
            <Route path="/settings" element={<ProfileSettingsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
ReactDOM.render(<App />, document.getElementById("root"));
