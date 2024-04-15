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
import { FetchCardsProvider } from "./contexts/fetchCardsContext";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthHandlerRoute />}>
            {/* Public Routes */}
            <Route path="/" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            {/* User Routes */}
            <Route path="/settings" element={<ProfileSettingsPage />} />
            <Route path="/home" element={<FetchTransactionsProvider><Home /></FetchTransactionsProvider>} />
            
            {/* Customer Routes */}
            <Route path="/cards" element={<FetchCardsProvider><CardsPage /></FetchCardsProvider>} />
            <Route path="/loans" element={<FetchLoansProvider><LoansPage /></FetchLoansProvider>} />
            <Route path="/deposits" element={<FetchDepositsProvider><DepositsPage /></FetchDepositsProvider>} />
            
            {/* Admin Routes */}
            <Route path="/admin/cards" element={<FetchCardsProvider><AdminCardsPage /></FetchCardsProvider>} />
            <Route path="/admin/loans" element={<FetchLoansProvider><AdminLoansPage /></FetchLoansProvider>} />
            <Route path="/admin/deposits" element={<FetchDepositsProvider><AdminDepositsPage /></FetchDepositsProvider>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
