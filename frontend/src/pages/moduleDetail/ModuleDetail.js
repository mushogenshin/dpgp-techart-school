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

  const { moduleData, error, isPending } = useFetchModule(modId);
  const [isPurchased, setIsPurchased] = useState(false);
  // const [targetUnit, setTargetUnit] = useState(null);

  useEffect(() => {
    // setTargetUnit(null);
    setIsPurchased(null);

    const getPurchased = () => {
      const isFreebie = (moduleData && moduleData.freebie) || false;
      return isFreebie || (purchased && purchased.includes(modId));
    };

    // const getFirstUnit = () => {
    //   if (moduleData && moduleData.units && moduleData.units.length > 0) {
    //     return moduleData.units[0];
    //   }
    //   return null;
    // };

    if (moduleData && moduleData.units) {
      if (unitParam) {
        const unitLookup = moduleData.units.find(
          (unit) => unit.id === unitParam
        );
        if (!unitLookup) {
          navigate("/404");
          return;
        }
        setIsPurchased(
          purchased && purchased.includes(modId) ? true : moduleData.freebie
        );
      } else {
        // setTargetUnit(getFirstUnit());
        setIsPurchased(getPurchased());
      }
    } else {
      // DO NOT try to access dynamic data again here
      // setTargetUnit(getFirstUnit());
      setIsPurchased(getPurchased());
    }

    // only show sidebar if there is some unit specified in the URL
    setShowSidebar(unitParam ? true : false);
  }, [purchased, modId, unitParam, moduleData, navigate, setShowSidebar]);

  const unitsData = moduleData && moduleData.units ? moduleData.units : [];
  const targetUnit = unitsData.find((unit) => unit.id === unitParam);

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
          <ChooseUnit unitsData={unitsData} activeUnitId={unitParam} />

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
