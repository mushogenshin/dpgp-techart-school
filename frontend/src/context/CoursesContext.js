import { createContext, useState } from "react";
import { useCollection } from "../hooks/firestore/useCollection";

export const CoursesContext = createContext();

export const CoursesContextProvider = ({ children }) => {
  const [ignoreLockedModules, setIgnoreLockedModules] = useState(false);
  const { documents: courses, error: coursesError } = useCollection("classes");

  return (
    <CoursesContext.Provider
      value={{
        courses,
        coursesError,
        ignoreLockedModules,
        setIgnoreLockedModules,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};
