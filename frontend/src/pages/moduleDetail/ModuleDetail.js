import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetchModule } from "../../hooks/useFetchModule";
import ModuleMetadata from "./ModuleMetadata";
import UnitDetail from "../unitDetail/UnitDetail";

import styles from "./Module.module.css";

export default function ModuleDetail({ setShowSidebar }) {
  const navigate = useNavigate();
  const { purchased } = useAuthContext();
  const { modId, unitId: unitParam } = useParams();

  const [unitsData, setUnitsData] = useState(null);
  const [targetUnit, setTargetUnit] = useState(null);
  const { moduleData, error, isPending } = useFetchModule(modId);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    setUnitsData(null);
    setTargetUnit(null);
    setIsPurchased(null);

    const getPurchased = () => {
      const isFreebie = (moduleData && moduleData.freebie) || false;
      return isFreebie || (purchased && purchased.includes(modId));
    };

    if (moduleData && moduleData.units) {
      if (unitParam) {
        const unitLookup = moduleData.units.find(
          (unit) => unit.id === unitParam
        );
        if (!unitLookup) {
          navigate("/404");
          return;
        }
        setUnitsData(moduleData.units);
        setTargetUnit(unitLookup);
        setIsPurchased(getPurchased());
      } else {
        setUnitsData(moduleData && moduleData.units ? moduleData.units : []);
        setTargetUnit(null);
        setIsPurchased(getPurchased());
      }
    } else {
      // DO NOT try to access dynamic data again here
      setUnitsData(null);
      setTargetUnit(null);
      setIsPurchased(null);
    }

    // only show sidebar if there is some unit specified in the URL
    setShowSidebar(unitParam ? true : false);
  }, [purchased, modId, unitParam, moduleData, navigate, setShowSidebar]);

  return isPending ? (
    <h2>Đợi xíu nha 😙...</h2>
  ) : (
    <div>
      {error && <h2>😳 {error}</h2>}
      {moduleData && <ModuleMetadata moduleData={moduleData} />}
      <hr></hr>
      {isPurchased ? (
        <div>
          {/* carousel-style clickable elements to select a Unit */}
          <ChooseUnit
            unitsData={unitsData}
            activeUnitId={targetUnit ? targetUnit.id : null}
          />

          {unitParam && (
            <UnitDetail unit={targetUnit} setShowSidebar={setShowSidebar} />
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
  const { courseId, modId, unitId: unitParam } = useParams();

  useEffect(() => {
    console.log("Unit ID Param:", unitParam);
    console.log("Active Unit:", activeUnitId);
  }, [unitsData, activeUnitId]);

  if (!unitParam) {
    // if no unit ID param is specified, redirect to the first unit
    // const route = `/course/${courseId}/${modId}/${unitsData[0].id}`;
    // console.log("Should redirect to first unit", route);
    // console.log("Should redirecting to first unit", moduleData.units[0].id);
    // navigate(`/course/${courseId}/${modId}/${moduleData.units[0].id}`);
  }

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
