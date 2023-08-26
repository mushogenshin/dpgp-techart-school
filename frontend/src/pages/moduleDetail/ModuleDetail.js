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
  const { courseId, modId, unitId: unitParam } = useParams();

  const [targetUnit, setTargetUnit] = useState(null);
  const [units, setUnits] = useState(null);
  const { mod, error, isPending } = useFetchModule(modId);
  const [isPurchased, setIsPurchased] = useState(null);

  useEffect(() => {
    if (mod && mod.units && unitParam) {
      // check if unitParam is valid
      if (!mod.units.find((unit) => unit.id === unitParam)) {
        setTargetUnit(null);
        setIsPurchased(null);
        // navigate("/404");
        console.warn("Unit not found:", unitParam);
        return;
      }
    }

    // wait for module to be fetched before setting units
    setUnits(mod && mod.units ? mod.units : []);

    // update the target unit if the unit ID param in the URL changes
    setTargetUnit(
      (mod && mod.units && mod.units.find((unit) => unit.id === unitParam)) ||
        null
    );

    // if (!unitParam && mod && mod.units && mod.units.length > 0) {
    //   // if no unit param is specified, redirect to the first unit
    //   console.log("Redirecting to first unit", mod.units[0].id);
    //   navigate(`/course/${courseId}/${modId}/${mod.units[0].id}`);
    // }

    const isFreebie = (mod && mod.freebie) || false;
    setIsPurchased(isFreebie || (purchased && purchased.includes(modId)));

    // only show sidebar if there is some unit specified in the URL
    setShowSidebar(unitParam ? true : false);
  }, [purchased, courseId, modId, unitParam, mod, navigate, setShowSidebar]);

  return isPending ? (
    <h2>Đợi xíu nha 😙...</h2>
  ) : (
    <div>
      {error && <h2>😳 {error}</h2>}
      {mod && <ModuleMetadata mod={mod} />}
      <hr></hr>
      {isPurchased ? (
        <div>
          {/* carousel-style clickable elements to select a Unit */}
          <ChooseUnit
            courseId={courseId}
            modId={modId}
            units={units}
            activeUnit={unitParam}
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

function ChooseUnit({ courseId, modId, units, activeUnit }) {
  const navigate = useNavigate();

  const routeActiveUnit = (target, i) => {
    navigate(`/course/${courseId}/${modId}/${target}`);
  };

  return (
    <div className={styles.carousel}>
      {units && units.length > 0 ? (
        <ul>
          {units.map((unit, index) => (
            <li
              key={index}
              onClick={() => routeActiveUnit(unit.id, index)}
              className={activeUnit === unit.id ? styles.active : {}}
            >
              {unit.name || `Unit ${index + 1}`}
            </li>
          ))}
        </ul>
      ) : (
        <h3>😳 Khóa học này trống trơn, không tìm thấy modules nào.</h3>
      )}
    </div>
  );
}
