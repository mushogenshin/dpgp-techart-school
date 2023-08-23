import Block from "../../components/Block";
import styles from "./Lesson.module.css";

export default function Lesson({ lesson }) {
  // console.log("Lesson", lesson);

  return (
    <div className={styles.lesson}>
      {lesson.blocks &&
        lesson.blocks.map((block, index) => (
          <Block key={index} block={block} />
        ))}
    </div>
  );
}
