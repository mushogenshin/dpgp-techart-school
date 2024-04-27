import { useFetchPublicPage } from "../../hooks/firestore/useFetchPublicPage";
import ContentBlock from "../../components/ContentBlock/ContentBlock";

import styles from "./Home.module.css";

export default function Home() {
  const { pageData, error, isPending } = useFetchPublicPage("home");
  const blocks = pageData?.versions["1"]?.blocks;

  // console.log("blocks", blocks);

  return (
    <div className={styles.home}>
      TODO: show all courses that are about to start
    </div>
  );
}
