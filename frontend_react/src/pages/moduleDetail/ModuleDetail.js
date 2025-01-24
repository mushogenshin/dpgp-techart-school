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

  // allow viewing if content is freebie
  const isFreebie = (moduleData && moduleData.freebie) || false;
  // see if user owns this module
  const isPurchased = isFreebie || (purchased && purchased.includes(modId));
  // check if the unit param is valid
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

      {/* module metadata */}
      {moduleData && <ModuleMetadata moduleData={moduleData} />}
      <hr></hr>

      {isPurchased ? (
        <div>
          {/* list of buttons to choose which unit to view */}
          <ChooseUnit unitsData={unitsData} activeUnitId={unitParam} />

          {/* show the unit detail, i.e. lesson contents */}
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

/**
 * Carousel-style clickable elements to select a Unit.
 * @param {string} activeUnitId: used to highlight the selected Unit
 */
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
