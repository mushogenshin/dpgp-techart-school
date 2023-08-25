import { createContext } from "react";
import { useCollection } from "../hooks/useCollection";
import { useCollectionLength } from "../hooks/useCollectionLength";

export const CoursesContext = createContext();

export const CoursesContextProvider = ({ children }) => {
  const { documents: courses, error: coursesError } = useCollection("classes");
  const { length: usersCount } = useCollectionLength("users");

  return (
    <CoursesContext.Provider value={{ courses, coursesError, usersCount }}>
      {children}
    </CoursesContext.Provider>
  );
};
