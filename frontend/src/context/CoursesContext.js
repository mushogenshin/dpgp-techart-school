import { createContext } from "react";
import { useCollection } from "../hooks/firestore/useCollection";

export const CoursesContext = createContext();

export const CoursesContextProvider = ({ children }) => {
  const { documents: courses, error: coursesError } = useCollection("classes");

  return (
    <CoursesContext.Provider value={{ courses, coursesError }}>
      {children}
    </CoursesContext.Provider>
  );
};
