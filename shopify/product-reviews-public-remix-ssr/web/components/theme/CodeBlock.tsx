import { Button, Card, Text, InlineStack, Box } from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

// Highlight entire code block and split into lines while preserving syntax highlighting
function highlightCodeAndSplitIntoLines(
  code: string,
  language: string | null
): React.ReactNode[][] {
  if (!language || language === "text" || !hljs.getLanguage(language)) {
    return code.split("\n").map((line) => [line]);
  }

  try {
    // Use highlight.js to get the actual highlighted HTML for the entire code
    const result = hljs.highlight(code, { language });
    const html = result.value;

    // Decode HTML entities before parsing
    const decodedHtml = html
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");

    // Split the highlighted HTML by newlines while preserving HTML tags
    const lines = decodedHtml.split("\n");
    const highlightedLines: React.ReactNode[][] = [];

    for (const line of lines) {
      // Parse each line's HTML to convert to React elements
      const parts = line.split(/(<span class="[^"]*">|<\/span>)/);
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

      highlightedLines.push(elements.length > 0 ? elements : [line]);
    }

    return highlightedLines;
  } catch (error) {
    console.warn(`Failed to highlight ${language}:`, error);
    return code.split("\n").map((line) => [line]);
  }
}

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
  const shouldShowCollapse = lines.length > linesShownWhenCollapsed;

  const renderCodeWithLineNumbers = useCallback(
    (codeLines: string[], showLineNumbers = true, isCollapsed = false) => {
      // Get highlighted lines for the entire code block
      const highlightedLines = highlightCodeAndSplitIntoLines(code, language);

      return (
        <Box position="relative">
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
              <Box key={index}>
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
                <span style={{ flex: 1 }}>
                  {highlightedLines[index] || [line]}
                </span>
              </Box>
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
        </Box>
      );
    },
    [language]
  );

  const handleCopy = useCallback(async () => {
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
  }, [code]);

  return (
    <Card background="bg-surface-secondary">
      <InlineStack align="space-between" blockAlign="center">
        <InlineStack gap="200" blockAlign="center">
          {title && (
            <Text as="span" variant="bodySm" tone="subdued">
              {title}
            </Text>
          )}
        </InlineStack>
        <Button onClick={handleCopy}>Copy</Button>
      </InlineStack>
      {shouldShowCollapse ? (
        <>
          {open ? (
            <Box>{renderCodeWithLineNumbers(lines, true, false)}</Box>
          ) : (
            <Box>
              {renderCodeWithLineNumbers(
                lines.slice(0, linesShownWhenCollapsed),
                true,
                true
              )}
            </Box>
          )}
          <Box padding="100" background="bg-surface-secondary">
            <InlineStack align="center" blockAlign="center">
              <Button
                variant="monochromePlain"
                icon={open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                onClick={() => setOpen(!open)}
              >
                {open ? "Show less" : "Show more"}
              </Button>
            </InlineStack>
          </Box>
        </>
      ) : (
        <Box>{renderCodeWithLineNumbers(lines, true, false)}</Box>
      )}
    </Card>
  );
}
