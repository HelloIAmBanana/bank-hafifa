import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/Signup";
import SignInPage from "./pages/Signin";
import { AuthHandlerRoute } from "./ProtectedRoutes";
import ProfileSettingsPage from "./pages/ProfileSettings";
import LoansPage from "./pages/Loans";
import DepositsPage from "./pages/Deposits";
import Home from "./pages/Home";
import CardsPage from "./pages/Cards";
import AdminUsersPage from "./pages/adminPages/Users";
import "./style.css";
import "./App.css";
import { FetchLoansProvider } from "./contexts/fetchLoansContext";
import { FetchDepositsProvider } from "./contexts/fetchDepositsContext";
import { FetchTransactionsProvider } from "./contexts/fetchTransactionsContext";
import { FetchCardsProvider } from "./contexts/fetchCardsContext";
import { FetchUsersProvider } from "./contexts/fetchUserContext";

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
            <Route path="admin">
              <Route path="cards" element={<FetchCardsProvider><CardsPage /></FetchCardsProvider>} />
              <Route path="loans" element={<FetchLoansProvider><LoansPage /></FetchLoansProvider>} />
              <Route path="deposits" element={<FetchDepositsProvider><DepositsPage /></FetchDepositsProvider>} />
              <Route path="users" element={<FetchUsersProvider><AdminUsersPage /></FetchUsersProvider>} />
            </Route>

            {/* User Spectating Routes */}
            <Route path="admin/user">
              <Route path="cards/:userID" element={<FetchCardsProvider><CardsPage /></FetchCardsProvider>} />
              <Route path='loans/:userID' element={<FetchLoansProvider><LoansPage /></FetchLoansProvider>} />
              <Route path="deposits/:userID" element={<FetchDepositsProvider><DepositsPage /></FetchDepositsProvider>} />
            </Route> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
