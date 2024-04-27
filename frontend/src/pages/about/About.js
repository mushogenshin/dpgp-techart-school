import { useFetchPublicPage } from "../../hooks/firestore/useFetchPublicPage";
import ContentBlock from "../../components/ContentBlock/ContentBlock";

import styles from "./About.module.css";

export default function About() {
  const { pageData, error, isPending } = useFetchPublicPage("about");
  const blocks = pageData?.versions["1"]?.blocks;

  return (
    <div className={styles.home}>
      {error && <h2>😳 {error}</h2>}
      {isPending ? (
        <p>Đợi xíu nha 😙...</p>
      ) : (
        blocks &&
        blocks.map((block, index) => <ContentBlock key={index} block={block} />)
      )}
    </div>
  );
}
