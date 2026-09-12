"use client";

import katex from "katex";

interface MathTextProps {
  children: string;
  className?: string;
}

function renderMath(tex: string, displayMode = false) {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: false,
  });
}

function renderSegment(text: string, key: number) {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  return (
    <span
      key={key}
      dangerouslySetInnerHTML={{
        __html: renderMath(trimmed),
      }}
    />
  );
}

export default function MathText({ children, className = "" }: MathTextProps) {
  if (!children) {
    return null;
  }

  const text = String(children);

  // Supports:
  // $...$       inline math
  // $$...$$     display math
  // \(...\)     inline math
  // \[...\]     display math
  const delimiterPattern =
    /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g;

  const parts = text.split(delimiterPattern);

  const hasDelimiters = parts.some(
    (part) =>
      part.startsWith("$$") ||
      part.startsWith("$") ||
      part.startsWith("\\(") ||
      part.startsWith("\\["),
  );

  // Existing PhysicsRishi content contains raw LaTeX without
  // delimiters. Handle formula-like strings automatically.
  const hasRawLatex =
    /\\[a-zA-Z]+|(?:\^|_)\{[^}]+\}|(?:\^|_)[-+]?\d+(?:\.\d+)?|\\[()[\]{}]|[A-Za-z]\^\{|[A-Za-z]_\{/.test(
      text,
    );

  if (!hasDelimiters && hasRawLatex) {
    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{
          __html: renderMath(text),
        }}
      />
    );
  }

  if (!hasDelimiters) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          return (
            <span
              key={index}
              className="block my-3 overflow-x-auto"
              dangerouslySetInnerHTML={{
                __html: renderMath(part.slice(2, -2), true),
              }}
            />
          );
        }

        if (part.startsWith("$") && part.endsWith("$")) {
          return renderSegment(part.slice(1, -1), index);
        }

        if (part.startsWith("\\(") && part.endsWith("\\)")) {
          return renderSegment(part.slice(2, -2), index);
        }

        if (part.startsWith("\\[") && part.endsWith("\\]")) {
          return (
            <span
              key={index}
              className="block my-3 overflow-x-auto"
              dangerouslySetInnerHTML={{
                __html: renderMath(part.slice(2, -2), true),
              }}
            />
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
