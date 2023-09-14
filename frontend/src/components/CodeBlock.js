import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      {...props}
      children={String(children).replace(/\n$/, "")}
      style={materialDark}
      language={match[1]}
      PreTag="div"
      customStyle={preStyles}
      wrapLines={true}
      showLineNumbers
    />
  ) : (
    <code {...props} className={className}>
      {children}
    </code>
  );
}

const preStyles = {
  fontSize: "0.8rem",
};
