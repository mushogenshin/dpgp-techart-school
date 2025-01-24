import ContentBlock from "../../components/contentBlock/ContentBlock";
import styles from "./Lesson.module.css";

export default function Lesson({ lesson }) {
  // console.log("Lesson", lesson);

  return (
    <div className={styles.lesson}>
      {lesson.blocks &&
        lesson.blocks.map((block, index) => (
          <ContentBlock key={index} inner={block} />
        ))}
    </div>
  );
}
