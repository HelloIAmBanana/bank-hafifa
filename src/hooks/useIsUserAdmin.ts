import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../AuthService";
import { UserContext } from "../UserProvider";

export function useIsUserAdmin() {
  const navigate = useNavigate();
  const [currentUser] = useContext(UserContext);

  useEffect(() => {
    if (currentUser) {
      if (AuthService.isUserAdmin(currentUser)) {
        navigate(`/home`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
}
