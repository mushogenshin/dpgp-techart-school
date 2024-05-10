import { useContext } from "react";
import { CoursesContext } from "../../context/CoursesContext";

export const useCoursesContext = () => {
  const context = useContext(CoursesContext);

  if (!context) {
    throw new Error(
      "useCoursesContext must be used within CoursesContextProvider"
    );
  }

  return context;
};
