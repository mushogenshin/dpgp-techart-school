import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import styles from "./Unit.module.css";

export default function UnitDetail({ courseId, moduleId, unit }) {
  useEffect(() => {
    //
  });

  return (
    <div>
      TODO: show Unit
      {courseId} {moduleId} {unit.id}
    </div>
  );
}
