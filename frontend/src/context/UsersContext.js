import { createContext } from "react";
import { useCollectionLength } from "../hooks/firestore/useCollectionLength";
import { useAuthContext } from "../hooks/auth/useAuthContext";

export const UsersContext = createContext();

export const UsersContextProvider = ({ children }) => {
  const { elevatedRole } = useAuthContext();
  const { length: usersCount } = useCollectionLength(
    "users",
    elevatedRole ? false : true // bypass if not elevated role
  );

  return (
    <UsersContext.Provider value={{ usersCount }}>
      {children}
    </UsersContext.Provider>
  );
};
