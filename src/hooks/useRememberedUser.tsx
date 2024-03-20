import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../AuthService";

export function useRememberedUser() {
  const navigate = useNavigate();
  useEffect(() => {
    if (AuthService.getAuthToken()) {
      navigate("/home");
    }
  }, [navigate]);
}
