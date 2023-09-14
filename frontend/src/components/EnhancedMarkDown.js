import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

/**
 * A component that renders Markdown with syntax highlighting and
 * anchor opened in a new tab.
 *
 * @param {string} children - The Markdown content to render.
 */
export default function EnhancedMarkDown({ children }) {
  return (
    <ReactMarkdown
      children={children}
      linkTarget="_blank"
      components={{
        code({ ...props }) {
          return CodeBlock({ ...props });
        },
        // a({ ...props }) {
        //   return <a {...props} target="_blank" rel="noopener noreferrer" />;
        // },
      }}
    />
  );
}
