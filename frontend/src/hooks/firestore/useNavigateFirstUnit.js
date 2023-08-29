import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase_config";

export function useNavigateFirstUnit() {
  const navigate = useNavigate();
  const { courseId, modId, unitId: unitParam } = useParams();

  useEffect(() => {
    // only redirect if there is no unit ID param
    if (modId && !unitParam) {
      const moduleRef = doc(db, "modules", modId);
      getDoc(moduleRef)
        .then((doc) => {
          if (doc.exists()) {
            const moduleData = { ...doc.data(), id: doc.id };
            // moduleData.starts_at = moduleData.starts_at.toDate();
            // moduleData.ends_at = moduleData.ends_at.toDate();

            const firstUnit =
              moduleData.units && moduleData.units.length > 0
                ? moduleData.units[0]
                : null;

            if (firstUnit) {
              console.log("Redirecting to first unit:", firstUnit.id);
              navigate(`/course/${courseId}/${modId}/${firstUnit.id}`, {
                replace: true,
              });
            }
          }
        })
        .catch((error) => {
          console.warn("Error getting document:", error.message);
        });
    }
  }, [courseId, modId, unitParam, navigate]);

  return;
}
