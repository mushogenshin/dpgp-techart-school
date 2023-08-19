import { useState, useEffect, useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";

export const useMapModulesToCourses = (moduleIds) => {
  const [coursesFromModules, setCoursesFromModules] = useState([]);
  const { courses: allCourses } = useContext(CoursesContext);

  useEffect(() => {
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
    setCoursesFromModules(combinedCourses);
  }, [allCourses, moduleIds]);

  return coursesFromModules;
};
