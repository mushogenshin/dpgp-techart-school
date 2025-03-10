import { useFetchLivePage } from "../../hooks/firestore/useFetchLivePage";
import ContentBlock from "../../components/contentBlock/ContentBlock";
import SubscribeForm from "../subscription/SubscribeForm";

import styles from "./About.module.css";

export default function About() {
  return (
    <div>
      <Manifesto />
      <div>
        {/* this is only visible to guests */}
        <SubscribeForm source="web-manifesto-page" />
      </div>
    </div>
  );
}

function Manifesto() {
  const { pageData, error, isPending } = useFetchLivePage(
    "public_pages",
    "about"
  );
  const blocks = pageData?.versions["1"]?.blocks;

  return (
    <div className={styles.home}>
      {error && <h2>😳 Failed to fetch "about": {error}</h2>}
      {isPending ? (
        <p>Đợi xíu nha 😙...</p>
      ) : (
        blocks &&
        blocks.map((block, index) => <ContentBlock key={index} inner={block} />)
      )}
    </div>
  );
}
