import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetchModule } from "../../hooks/useFetchModule";
import ModuleMetadata from "./ModuleMetadata";

import styles from "./Module.module.css";

export default function ModuleDetail({ courseId, moduleId }) {
  const navigate = useNavigate();
  const { purchased } = useAuthContext();
  const { unitId: unitParam, contentId } = useParams();

  // the target unit is parsed from the unit ID param in the URL
  const [targetUnit, setTargetUnit] = useState(unitParam);

  const [units, setUnits] = useState(null);
  const { mod, error, isPending } = useFetchModule(moduleId);

  useEffect(() => {
    if (mod && mod.units && unitParam) {
      // check if unitParam is valid
      if (!mod.units.find((unit) => unit.id === unitParam)) {
        navigate("/404");
        return;
      }
    }

    setUnits(mod && mod.units ? mod.units : []);
    setTargetUnit(unitParam);
  }, [mod, unitParam, navigate]);

  const isPurchased = purchased && purchased.includes(moduleId);

  return isPending ? (
    <h2>Đợi xíu nha 😙...</h2>
  ) : (
    <div>
      {error && <h2>😳 {error}</h2>}
      {mod && <ModuleMetadata mod={mod} />}
      <hr></hr>
      {isPurchased ? (
        <div>
          <ChooseUnit
            courseId={courseId}
            moduleId={moduleId}
            units={units}
            activeUnit={targetUnit}
          />
        </div>
      ) : (
        <h3>
          📺 Để xem video bài giảng, liên lạc DPGP để mua module này (👉{" "}
          {moduleId})
        </h3>
      )}
      {/* {modules.length > 0 ? (
        <Carousel courseId={courseId} modules={modules} />
      ) : (
        <h2>😳 Khóa học này trống trơn, không tìm thấy modules nào.</h2>
      )} */}
    </div>
  );
}

function ChooseUnit({ courseId, moduleId, units, activeUnit }) {
  const navigate = useNavigate();

  const routeActiveUnit = (target, i) => {
    navigate(`/course/${courseId}/${moduleId}/${target}`);
  };

  return (
    <div className={styles.carousel}>
      {units && (
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
      )}
    </div>
  );
}
