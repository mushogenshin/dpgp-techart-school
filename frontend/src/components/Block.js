import ReactMarkdown from "react-markdown";
import Vimeo from "./Vimeo";

export default function Block({ block }) {
  return (
    <div>
      {block.type === "text" ? (
        <ReactMarkdown>{block.data}</ReactMarkdown>
      ) : block.type === "video" ? (
        <Vimeo id={block.data} />
      ) : null}
    </div>
  );
}
