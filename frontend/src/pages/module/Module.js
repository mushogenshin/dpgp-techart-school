import { useEffect, useState } from "react";

import styles from "./Module.module.css";

export default function LearningModule({ mod, purchased }) {
  const [isPending, setIsPending] = useState(false);
  const [contents, setContents] = useState(null);

  useEffect(() => {
    if (purchased && mod.contents) {
      setIsPending(true);

      console.log("TODO: fetch contents of this module");
      // TODO: remember to setContents

      setIsPending(false);
    }
  }, [purchased, mod]);

  if (!purchased) {
    return (
      <h3>
        📺 Để xem video bài giảng, liên lạc DPGP để mua module này (👉 {mod.id})
      </h3>
    );
  }

  return isPending ? (
    <p>Đang tải nội dung bài giảng ⏱️ ...</p>
  ) : (
    <div className={styles.mod}>
      {contents && <Carousel contents={contents} />}
    </div>
  );
}

function Carousel({ contents }) {
  const [active, setActive] = useState(
    parseInt(localStorage.getItem("activeUnitIndex")) || 0
  );

  useEffect(() => {
    localStorage.setItem("activeUnitIndex", active);
  }, [active]);

  console.log(contents);

  return (
    <div className={styles.carousel}>
      CAROUSEL
      {/* <ul>
        {contents.map((mod, index) => (
          <li
            key={index}
            onClick={() => setActive(index)}
            className={active === index ? styles.active : {}}
          >
            {mod.id}
          </li>
        ))}
      </ul>
      {contents.length > 1 && (
        <small className={styles.hint}>Week #{active + 1}:</small>
      )} */}
      {/* <LearningModule mod={weeks[active]} /> */}
    </div>
  );
}
