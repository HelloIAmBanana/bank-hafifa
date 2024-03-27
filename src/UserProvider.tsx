import React, {useEffect,useState} from 'react';
import { User } from './models/user';
import AuthService from './AuthService';

export const UserContext = React.createContext<User|undefined>(undefined);

const UserProvider = ({ children }: React.PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User>();

  const storeCurrentUser = async () => {
    const user= await AuthService.getCurrentUser() as User;
    setCurrentUser(user);
  };

  useEffect(() => {
    storeCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={currentUser}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
