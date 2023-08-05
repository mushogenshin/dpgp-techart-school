import { db } from "../../firebase_config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CourseDetail({}) {
  const { id } = useParams();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const classRef = doc(db, "classes", id);

    getDoc(classRef).then(async (classSnapshot) => {
      const modulePromises = classSnapshot.data().modules.map((mod_id) => {
        const moduleRef = doc(db, "modules", mod_id);

        return getDoc(moduleRef).then((moduleSnapshot) => {
          const mod = { ...moduleSnapshot.data(), id: moduleSnapshot.id };
          // mod.starts_at = mod.starts_at.toDate();
          // mod.ends_at = mod.ends_at.toDate();
          return mod;
        });
      });

      const results = await Promise.all(modulePromises);
      setModules(results);
    });
  }, [id]);
  return (
    <div>
      {modules.map((m) => (
        <li key={m.id}>
          Module: {m.description}
          {/* <br />
          <small>
            starts: {m.starts_at.toLocaleString()}
            <br />
            ends: {m.ends_at.toLocaleString()}
          </small> */}
        </li>
      ))}
    </div>
  );
}
