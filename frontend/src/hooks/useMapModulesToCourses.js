import { useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";

export const useMapModulesToCourses = (moduleIds) => {
  const { courses: allCourses } = useContext(CoursesContext);

  const combineCourses = () => {
    const courseIds = new Set();
    const combinedCourses = moduleIds.flatMap((modId) =>
      allCourses.filter((course) => {
        if (course.modules.includes(modId) && !courseIds.has(course.id)) {
          courseIds.add(course.id);
          return true;
        }
        return false;
      })
    );
    return combinedCourses;
  };

  return combineCourses();
};
