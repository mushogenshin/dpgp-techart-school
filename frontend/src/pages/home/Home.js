import { useFetchPublicPage } from "../../hooks/firestore/useFetchPublicPage";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import ContentBlock from "../../components/ContentBlock/ContentBlock";

import styles from "./Home.module.css";

export default function Home() {
  const { pageData, error, isPending } = useFetchPublicPage("home");
  const opening = pageData?.opening;

  console.log("opening", opening);

  return (
    <div className={styles.home}>
      {error && <h2>😳 {error}</h2>}

      {isPending ? (
        <p>Đợi xíu nha 😙...</p>
      ) : (
        <div>
          {opening?.length} lớp đang chiêu sinh:
          <ul>
            {opening &&
              opening.map((item, index) => (
                <li key={index}>
                  <Opening cls={item} />
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Opening({ cls }) {
  const { classId, starts_at } = cls;
  const [daysLeft, setDaysLeft] = useState(calculateDaysLeft(starts_at));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDaysLeft(calculateDaysLeft(starts_at));
    }, 24 * 60 * 60 * 1000); // Update every 24 hours

    return () => clearTimeout(timer); // Clear the timer if the component is unmounted
  }, [starts_at]);

  return (
    <div>
      <span>
        {starts_at &&
          starts_at.toDate().toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
      </span>{" "}
      👉 <span className={styles.opening}>{classId}</span>
      <br />
      <span className={styles.countdown}>({daysLeft} ngày nữa khai giảng)</span>
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
