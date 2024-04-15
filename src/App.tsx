import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/signup";
import SignInPage from "./pages/signin";
import { AuthHandlerRoute } from "./ProtectedRoutes";
import ProfileSettingsPage from "./pages/profileSettings";
import LoansPage from "./pages/loans";
import DepositsPage from "./pages/deposits";
import AdminCardsPage from "./pages/adminPages/cards";
import AdminLoansPage from "./pages/adminPages/loans";
import AdminDepositsPage from "./pages/adminPages/deposits";
import Home from "./pages/home";
import CardsPage from "./pages/cards";
import "./style.css";
import "./App.css";
import { FetchLoansProvider } from "./contexts/fetchLoansContext";
import { FetchDepositsProvider } from "./contexts/fetchDepositsContext";
import { FetchTransactionsProvider } from "./contexts/fetchTransactionsContext";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthHandlerRoute />}>
            <Route path="/" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<FetchTransactionsProvider><Home /></FetchTransactionsProvider>} />
            <Route path="/loans" element={<FetchLoansProvider><LoansPage /></FetchLoansProvider>} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/admin/cards" element={<AdminCardsPage />} />
            <Route path="/admin/loans" element={<FetchLoansProvider><AdminLoansPage /></FetchLoansProvider>} />
            <Route path="/admin/deposits" element={<FetchDepositsProvider><AdminDepositsPage /></FetchDepositsProvider>} />
            <Route path="/deposits" element={<FetchDepositsProvider><DepositsPage /></FetchDepositsProvider>} />
            <Route path="/settings" element={<ProfileSettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
