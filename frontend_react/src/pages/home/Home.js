import { useFetchPublicPage } from "../../hooks/firestore/useFetchPublicPage";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "./Home.module.css";

export default function Home() {
  const { pageData, error, isPending } = useFetchPublicPage("home");
  // opening classes, sorted by starts_at
  const opening = pageData?.opening?.sort((a, b) => a.starts_at - b.starts_at);
  const selfTaught = pageData?.self_taught;

  return (
    <div className={styles.home}>
      {error && <h2>😳 {error}</h2>}

      {isPending ? (
        <p>Đợi xíu nha 😙...</p>
      ) : (
        <div>
          /* Opening classes */
          {opening?.length > 0 && (
            <>
              <p className={styles.title}>
                {opening.length} lớp đang chiêu sinh:
              </p>
              <ul>
                {opening.map((item, index) => (
                  <li key={index}>
                    <Available cls={item} timebound={true} />
                  </li>
                ))}
              </ul>
            </>
          )}
          {/* Self-taught classes */}
          <p className={styles.title}>
            {selfTaught?.length} lớp tự học (access trọn đời):
          </p>
          <ul>
            {selfTaught &&
              selfTaught.map((item, index) => (
                <li key={index}>
                  <Available cls={item} timebound={false} />
                </li>
              ))}
          </ul>
          {/* Free courses */}
          <Link
            to="/courses"
            className={styles.title}
            style={{ color: "rgb(149, 143, 255)" }}
          >
            🤤 Và các khoá miễn phí
          </Link>
        </div>
      )}
    </div>
  );
}

function Available({ cls, timebound }) {
  const { classId, starts_at, url, description } = cls;
  const [daysLeft, setDaysLeft] = useState(calculateDaysLeft(starts_at));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDaysLeft(calculateDaysLeft(starts_at));
    }, 24 * 60 * 60 * 1000); // Update every 24 hours

    return () => clearTimeout(timer); // Clear the timer if the component is unmounted
  }, [starts_at]);

  return (
    <div>
      {timebound && starts_at && (
        <span>
          {starts_at.toDate().toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          {" 👉"}
        </span>
      )}
      {/* Link with class ID */}
      <LinkOptional
        url={url}
        label={<span className={styles.opening}>{classId}</span>}
      />
      {/* Count down */}
      {timebound && (
        <span className={styles.countdown}>
          ({daysLeft} ngày nữa khai giảng)
        </span>
      )}
      <br />
      {/* Description */}
      <LinkOptional url={url} label={description} />
    </div>
  );
}

function calculateDaysLeft(starts_at) {
  if (!starts_at) return "";

  const now = new Date();
  const startDate = starts_at.toDate();
  const differenceInTime = startDate.getTime() - now.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays > 0 ? differenceInDays : 0;
}

function LinkOptional({ url, label }) {
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  ) : (
    <span>{label}</span>
  );
}
