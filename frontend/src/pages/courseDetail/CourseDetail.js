import { db } from "../../firebase_config";
import { query, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CourseDetail() {
  const { id } = useParams();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    let ref = collection(db, "modules");

    getDocs(ref).then((querySnapshot) => {
      const results = [];
      querySnapshot.forEach((doc) => {
        const matches = doc
          .data()
          .parent_classes.some((parent_class) => parent_class.class_id === id);

        if (matches) {
          const match = { ...doc.data(), id: doc.id };
          match.starts_at = match.starts_at.toDate();
          match.ends_at = match.ends_at.toDate();
          results.push(match);
        }
      });

      results.sort((a, b) => {
        const orderA =
          a.parent_classes.find((pc) => pc.class_id === id)?.order || 0;
        const orderB =
          b.parent_classes.find((pc) => pc.class_id === id)?.order || 0;
        return orderA - orderB;
      });

      setModules(results);
    });
  }, [id]);

  return (
    <div>
      {modules.map((m) => (
        <li key={m.id}>
          Module: {m.description}
          <br />
          <small>
            starts: {m.starts_at.toLocaleString()}
            <br />
            ends: {m.ends_at.toLocaleString()}
          </small>
        </li>
      ))}
    </div>
  );
}
