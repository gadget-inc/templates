import { Button, Card, Text, InlineStack } from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import { useState, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

// Custom CSS to override Polaris and ensure highlight.js works
const customStyles = `
  .hljs-override {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    color: #374151 !important;
  }
  
  .hljs-override .hljs-keyword {
    color: #dc2626 !important;
    font-weight: 600 !important;
  }
  
  .hljs-override .hljs-string {
    color: #059669 !important;
  }
  
  .hljs-override .hljs-number {
    color: #2563eb !important;
  }
  
  .hljs-override .hljs-literal {
    color: #7c3aed !important;
  }
  
  .hljs-override .hljs-comment {
    color: #6b7280 !important;
    font-style: italic !important;
  }
  
  .hljs-override .hljs-function {
    color: #7c3aed !important;
    font-weight: 600 !important;
  }
  
  .hljs-override .hljs-title {
    color: #7c3aed !important;
    font-weight: 600 !important;
  }
  
  .hljs-override .hljs-params {
    color: #374151 !important;
  }
  
  .hljs-override .hljs-built_in {
    color: #ea580c !important;
  }
  
  .hljs-override .hljs-type {
    color: #5b21b6 !important;
  }
  
  .hljs-override .hljs-variable {
    color: #374151 !important;
  }
  
  .hljs-override .hljs-operator {
    color: #dc2626 !important;
  }
  
  .hljs-override .hljs-punctuation {
    color: #6b7280 !important;
  }
`;

export default function ({
  children,
  title,
  language = "text",
  linesShownWhenCollapsed = 12,
}: {
  children: string;
  title?: string;
  language?: string;
  linesShownWhenCollapsed?: number;
}) {
  const [open, setOpen] = useState(false);
  const code = children.trim();
  const lines = code.split("\n");

  // Inject custom CSS to override Polaris
  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleId = "hljs-override-styles";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = customStyles;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Simple syntax highlighting without HTML injection
  const highlightCode = (
    code: string,
    language: string | null
  ): React.ReactNode[] => {
    if (!language || language === "text" || !hljs.getLanguage(language)) {
      return [code];
    }

    try {
      // Use highlight.js to get the actual highlighted HTML
      const result = hljs.highlight(code, { language });

      // Parse the HTML safely by converting it to React elements
      // This is safer than dangerouslySetInnerHTML because we control the parsing
      const html = result.value;

      // Decode HTML entities before parsing
      const decodedHtml = html
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");

      // Simple HTML parser for highlight.js output
      const parts = decodedHtml.split(/(<span class="[^"]*">|<\/span>)/);
      const elements: React.ReactNode[] = [];

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (part.startsWith('<span class="')) {
          // Extract the class name
          const className = part.match(/class="([^"]*)"/)?.[1];
          if (className && parts[i + 1]) {
            // Create a React span with the highlight.js class
            elements.push(
              <span key={i} className={`hljs-override ${className}`}>
                {parts[i + 1]}
              </span>
            );
            i++; // Skip the next part since we've already processed it
          }
        } else if (!part.startsWith("</span>")) {
          // Regular text content
          if (part) {
            elements.push(part);
          }
        }
      }

      return elements.length > 0 ? elements : [code];
    } catch (error) {
      console.warn(`Failed to highlight ${language}:`, error);
      return [code];
    }
  };

  const renderCodeWithLineNumbers = (
    codeLines: string[],
    showLineNumbers = true,
    isCollapsed = false
  ) => {
    return (
      <div style={{ position: "relative" }}>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: 0,
            padding: "16px",
            backgroundColor: "#f6f6f7",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            fontFamily: "monospace",
            fontSize: "14px",
            lineHeight: "1.5",
            overflowX: "auto",
          }}
          className="hljs-override"
        >
          {codeLines.map((line, index) => (
            <div key={index} style={{ display: "flex" }}>
              {showLineNumbers && (
                <span
                  style={{
                    color: "#6d7175",
                    opacity: 0.6,
                    userSelect: "none",
                    paddingRight: "16px",
                    minWidth: "40px",
                    textAlign: "right",
                  }}
                >
                  {index + 1}
                </span>
              )}
              <span style={{ flex: 1 }}>{highlightCode(line, language)}</span>
            </div>
          ))}
        </pre>
        {isCollapsed && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60px",
              background: "linear-gradient(to bottom, transparent, #f6f6f7)",
              pointerEvents: "none",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
          />
        )}
      </div>
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Show toast notification using Shopify App Bridge
      if (typeof window !== "undefined" && (window as any).shopify?.toast) {
        (window as any).shopify.toast.show("Copied!", {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <Card background="bg-surface-secondary">
      <InlineStack align="space-between" blockAlign="start">
        <InlineStack gap="200" blockAlign="center">
          {title && (
            <Text as="span" variant="bodySm" tone="subdued">
              {title}
            </Text>
          )}
        </InlineStack>
        <Button onClick={handleCopy}>Copy</Button>
      </InlineStack>
      {open ? (
        <div>{renderCodeWithLineNumbers(lines, true, false)}</div>
      ) : (
        <div>
          {renderCodeWithLineNumbers(
            lines.slice(0, linesShownWhenCollapsed),
            true,
            true
          )}
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "8px",
          background: "#f6f6f7",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <Button
          variant="monochromePlain"
          icon={open ? ChevronUpIcon : ChevronDownIcon}
          onClick={() => setOpen(!open)}
        >
          {open ? "Show less" : "Show more"}
        </Button>
      </div>
    </Card>
  );
}
