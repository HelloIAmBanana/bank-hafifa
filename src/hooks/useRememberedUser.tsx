import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../components/AuthService";

function getUser(key: string) {
  const data = localStorage.getItem(key);
  const currentUser = data ? JSON.parse(data) : [];
  return currentUser;
}

export function useRememberedUser() {
  const navigate = useNavigate();
  useEffect(() => {
    const rememberedUser = getUser("rememberedUser");
    if (rememberedUser.id !== undefined) {
      AuthService.storeUserToStorage(rememberedUser);
      navigate("/home");
    }
    if (AuthService.getCurrentUserID() !== undefined) {
      navigate("/home");
    }
  }, [navigate]);
}
