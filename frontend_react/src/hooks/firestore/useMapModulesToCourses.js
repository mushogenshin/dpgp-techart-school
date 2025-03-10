import { useCoursesContext } from "../auth/useCoursesContext";

export const useMapModulesToCourses = (moduleIds) => {
  const { courses: allCourses } = useCoursesContext();

  const combineCourses = () => {
    const courseIds = new Set();
    const combinedCourses = moduleIds.flatMap((modId) =>
      allCourses.filter((course) => {
        if (
          course.modules &&
          course.modules.includes(modId) &&
          !courseIds.has(course.id)
        ) {
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
