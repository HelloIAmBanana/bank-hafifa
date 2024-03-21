import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../AuthService";

export function useSignedUser() {
  const navigate = useNavigate();
  useEffect(() => {
    if (AuthService.getAuthToken()) {
      navigate("/home");
    }
  }, [navigate]);
}

export function useNotSignedUser() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!AuthService.getAuthToken()) {
      navigate("/signin");
    }
  }, [navigate]);
}
