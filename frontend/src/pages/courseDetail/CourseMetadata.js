import styles from "./CourseDetail.module.css";

export default function CourseMetadata({ course }) {
  return (
    course && (
      <div>
        {course.location && (
          <p className={styles.location}>Địa điểm: {course.location}</p>
        )}

        <People title="Giảng viên" people={course.instructors} />
        <People title="Trợ giảng" people={course.assistants} />
      </div>
    )
  );
}

function People({ title, people }) {
  return (
    people && (
      <div className={styles.people}>
        {people.length > 1 ? (
          <ul>
            <h3>{title}: </h3>
            {people.map((instructor) => (
              <li key={instructor}>{instructor}</li>
            ))}
          </ul>
        ) : (
          <div>
            {people.length > 0 && (
              <p>
                <span className={styles.title}>{title}: </span>
                <span className={styles.person}>{people}</span>
              </p>
            )}
          </div>
        )}
      </div>
    )
  );
}
