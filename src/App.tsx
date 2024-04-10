import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/signup";
import SignInPage from "./pages/signin";
import { AuthHandlerRoute } from "./ProtectedRoutes";
import ProfileSettingsPage from "./pages/profileSettings";
import LoansPage from "./pages/loans";
import DepositsPage from "./pages/deposits";
import AdminCardsPage from "./pages/adminPages/cards";
import AdminLoansPage from "./pages/adminPages/loans";
import Home from "./pages/home";
import CardsPage from "./pages/cards";
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
            <Route path="/home" element={<Home />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/admin/cards" element={<AdminCardsPage />} />
            <Route path="/admin/loans" element={<AdminLoansPage />} />

            <Route path="/deposits" element={<DepositsPage />} />
            <Route path="/settings" element={<ProfileSettingsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
