import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from "react-dom";
import SignUpPage from "./pages/signup";
import SignInPage from "./pages/signin";
import WelcomePage from "./pages/welcome";
import './style.css';

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
        <Route path="/account" element={<WelcomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
ReactDOM.render(<App/>, document.getElementById("root"));
