import React from 'react';
import { User } from './models/user';
import AuthService from './AuthService';

export const UserContext = React.createContext<User|undefined>(undefined);

const UserProvider = ({ children }: React.PropsWithChildren) => {
  const [currentUser, setCurrentUser] = React.useState<User>();

  const storeCurrentUser = async () => {
    const user= await AuthService.getCurrentUser() as User;
    setCurrentUser(user);
  };

  React.useEffect(() => {
    storeCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={currentUser}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
