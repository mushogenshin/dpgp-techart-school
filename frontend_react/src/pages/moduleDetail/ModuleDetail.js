import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useFetchModule } from "../../hooks/firestore/useFetchModule";
import ModuleMetadata from "./ModuleMetadata";
import UnitDetail from "../unitDetail/UnitDetail";

import styles from "./Module.module.css";

export default function ModuleDetail({ setShowSidebar }) {
  const navigate = useNavigate();
  const { purchased } = useAuthContext();
  const { modId, unitId: unitParam } = useParams();

  const { moduleData, error, isPending } = useFetchModule(modId);

  const isFreebie = (moduleData && moduleData.freebie) || false;
  const isPurchased = isFreebie || (purchased && purchased.includes(modId));
  const unitsData = moduleData && moduleData.units ? moduleData.units : [];
  const unitLookup = unitsData.find((unit) => unit.id === unitParam);

  useEffect(() => {
    // we should wait for moduleData to be fetched before doing any redirection
    if (!unitLookup && unitParam && moduleData && moduleData.units) {
      navigate("/404");
      return;
    }
  }, [moduleData, unitParam, unitLookup, navigate]);

  return isPending ? (
    <h2>Đợi xíu nha 😙...</h2>
  ) : (
    <div>
      {error && <h2>😳 Failed to fetch module: {error}</h2>}
      {moduleData && <ModuleMetadata moduleData={moduleData} />}
      <hr></hr>
      {isPurchased ? (
        <div>
          {/* carousel-style clickable elements to select a Unit */}
          <ChooseUnit unitsData={unitsData} activeUnitId={unitParam} />

          {unitLookup && (
            <UnitDetail unitData={unitLookup} setShowSidebar={setShowSidebar} />
          )}
        </div>
      ) : (
        <h3>
          📺 Để xem video bài giảng, liên lạc DPGP để mua module này (👉 {modId}
          )
        </h3>
      )}
    </div>
  );
}

function ChooseUnit({ unitsData, activeUnitId }) {
  const navigate = useNavigate();
  const { courseId, modId } = useParams();

  const routeActiveUnit = (target) => {
    navigate(`/course/${courseId}/${modId}/${target}`);
  };

  return (
    <div className={styles.carousel}>
      {unitsData && unitsData.length > 0 ? (
        <ul>
          {unitsData.map((unitData, index) => (
            <li
              key={index}
              onClick={() => routeActiveUnit(unitData.id, index)}
              className={activeUnitId === unitData.id ? styles.active : {}}
            >
              {unitData.name || `Unit ${index + 1}`}
            </li>
          ))}
        </ul>
      ) : (
        <h3>😳 Khóa học này trống trơn, không tìm thấy modules nào.</h3>
      )}
    </div>
  );
}
