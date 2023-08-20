import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFetchModule } from "../../hooks/useFetchModule";
import ModuleMetadata from "./ModuleMetadata";

import styles from "./Module.module.css";

export default function ModuleDetail({ courseId, moduleId }) {
  const { purchased } = useAuthContext();
  const { unitId, contentId } = useParams();
  const [units, setUnits] = useState(null);

  // the target unit is parsed from the unit ID param in the URL
  const [targetUnit, setTargetUnit] = useState(unitId);

  //   console.log("ModuleDetail", unitId, contentId);

  const { mod, error, isPending } = useFetchModule(moduleId);
  const isPurchased = purchased && purchased.includes(moduleId);

  useEffect(() => {
    setUnits(mod && mod.units ? mod.units : []);
    setTargetUnit(unitId);
  }, [mod, unitId]);

  console.log(mod);

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
            active={targetUnit}
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

function ChooseUnit({ courseId, moduleId, units, active }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(null);

  const routeActiveUnit = (target, i) => {
    setIndex(i);
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
              className={active === unit.id ? styles.active : {}}
            >
              {unit.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
