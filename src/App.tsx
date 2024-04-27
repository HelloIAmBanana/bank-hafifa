import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import "./App.css";
import "./style.css";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
