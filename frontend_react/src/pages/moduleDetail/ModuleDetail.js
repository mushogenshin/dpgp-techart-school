import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useFetchModule } from "../../hooks/firestore/useFetchModule";
import ModuleMetadata from "./ModuleMetadata";
import UnitDetail from "../unitDetail/UnitDetail";

import styles from "./Module.module.css";

/**
 * Displays the details of a Module, including its Units and Lessons.
 * @param {function} setShowSidebar: a function to toggle the sidebar
 */
export default function ModuleDetail({ setShowSidebar }) {
  const navigate = useNavigate();
  const { purchased } = useAuthContext();
  const { modId, unitId: unitParam } = useParams();

  const { moduleData, error, isPending } = useFetchModule(modId);

  // whether the module is a freebie
  const isFreebie = (moduleData && moduleData.freebie) || false;

  // whether the user is qualified for a bonus module
  const isBonus =
    moduleData && moduleData.bonus_for
      ? moduleData.bonus_for
          .split(",")
          .map((prefix) => prefix.trim())
          .some(
            (prefix) =>
              purchased && purchased.some((id) => id.startsWith(prefix))
          )
      : false;

  // the user is allowed to access the module if one of the following is true:
  // 1. the module is a freebie
  // 2. the user has purchased the module
  // 3. the module is a bonus for the user
  const isPurchased =
    isFreebie || (purchased && purchased.includes(modId)) || isBonus;
  // check if the Unit param is valid
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
    <>
      {error && <h2>😳 Failed to fetch module: {error}</h2>}

      {/* module metadata */}
      {moduleData && <ModuleMetadata moduleData={moduleData} />}
      <hr></hr>

      {/* list of buttons to choose which Unit to view */}
      <ChooseUnit unitsData={unitsData} activeUnitId={unitParam} />

      {/* show the Unit detail, i.e. Lesson contents */}
      {unitLookup && (
        <UnitDetail
          unitData={unitLookup}
          isPurchased={isPurchased}
          setShowSidebar={setShowSidebar}
        />
      )}
    </>
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
        <h3>😳 Khóa học này trống trơn, không tìm thấy modules nào</h3>
      )}
    </div>
  );
}
