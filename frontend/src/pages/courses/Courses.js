import { db } from "../../firebase_config";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

import styles from "./Courses.module.css";

export default function Courses() {
  //   we avoid using `useCollection` hook to prevent unnecessary reloads
  //   NOTE: this is not updated in real-time
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "classes"));
      return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    };

    getCourses()
      .then((result) => setCourses(result))
      .catch((err) => setError(err));
  }, []);

  return (
    <div className={styles.courses}>
      <h2>ALL COURSES</h2>
      {error && <p>{error}</p>}
      {courses.map((cls) => (
        <li key={cls.id}>
          {cls.name} ({cls.id})
        </li>
      ))}
    </div>
  );
}
