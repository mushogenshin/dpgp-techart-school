import { createContext } from "react";
import { useCollection } from "../hooks/useCollection";

export const CoursesContext = createContext();

export const CoursesContextProvider = ({ children }) => {
  const { documents, error } = useCollection("classes", 5);

  return (
    <CoursesContext.Provider value={{ courses: documents, error }}>
      {children}
    </CoursesContext.Provider>
  );
};
