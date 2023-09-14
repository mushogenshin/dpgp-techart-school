import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

export default function EnhancedMarkDown({ children }) {
  return (
    <ReactMarkdown
      children={children}
      components={{
        code({ ...props }) {
          return CodeBlock({ ...props });
        },
        a({ ...props }) {
          return <a {...props} target="_blank" rel="noopener noreferrer" />;
        },
      }}
    />
  );
}
