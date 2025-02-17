import { useFetchLivePage } from "../../hooks/firestore/useFetchLivePage";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubscribeForm from "../subscription/SubscribeForm";

import styles from "./Buy.module.css";

const DLUS_GUIDE_URL =
  "https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/login-instructions%2Fdlus-guide.jpg?alt=media&token=e329c85f-6dfc-4789-9ce6-8aaff23c5a13";

export default function Buy() {
  return (
    <div>
      <Offers />
      <div style={{ height: "25" }}></div>
      {/* this is only visible to guests */}
      <SubscribeForm source="web-course-listing-page" />
    </div>
  );
}

function Offers() {
  const { pageData, error, isPending } = useFetchLivePage(
    "enrollment_desc",
    "products"
  );

  // // opening classes, sorted by starts_at
  // const opening = pageData?.opening?.sort((a, b) => a.starts_at - b.starts_at);
  // const selfTaught = pageData?.self_taught;

  return (
    <div className={styles.home}>
      {error && <h2>😳 Failed to fetch "home": {error}</h2>}

      {isPending ? (
        <p>Đợi xíu nha 😙...</p>
      ) : (
        <div>
          {/* OPENING CLASSES */}
          {/* {opening?.length > 0 && (
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
          )} */}

          {/* SELF-TAUGHT CLASSES  */}
          {pageData?.mapping && (
            <>
              <p className={styles.title}>Các lớp tự học (access trọn đời):</p>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Sản phẩm</th>
                    <th>Modules</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(pageData?.mapping)
                    .filter(([_, data]) => data.requires_website_access)
                    .map(([id, data]) => (
                      <tr key={id}>
                        <td>
                          <b>{id}</b>
                        </td>
                        <td>
                          {data.url ? (
                            <Link
                              to={data.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {data.name}
                            </Link>
                          ) : (
                            data.name
                          )}
                        </td>
                        <td className={styles.enrollment_modules}>
                          {data.module_ids}
                        </td>
                        <td className={styles.price}>{data.price}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )}

          <div style={{ padding: "50px" }}>
            <Link to={DLUS_GUIDE_URL} target="_blank" rel="noopener noreferrer">
              <img
                src={DLUS_GUIDE_URL}
                width="597"
                height="900"
                alt="hướng dẫn sử dụng DLUS"
              />
            </Link>
          </div>

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
