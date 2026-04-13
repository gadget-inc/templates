import type { ReactNode } from "react";

type Action = {
  content: ReactNode;
  onAction: () => void;
  tone?: "critical";
};

type Pagination = {
  hasNext?: boolean;
  hasPrevious?: boolean;
  onNext: () => void;
  onPrevious: () => void;
};

type PageLayoutProps = {
  children: ReactNode;
  title?: ReactNode;
  titleMetadata?: ReactNode;
  inlineSize?: "base" | "large";
  backAction?: Action;
  primaryAction?: Action;
  pagination?: Pagination;
};

export default function PageLayout({
  children,
  title,
  titleMetadata,
  inlineSize = "base",
  backAction,
  primaryAction,
  pagination,
}: PageLayoutProps) {
  return (
    <s-page inlineSize={inlineSize}>
        {(title || titleMetadata || backAction || primaryAction) && (
          <s-section>
            <s-grid alignItems="start" gap="base" gridTemplateColumns="1fr auto">
              <s-stack gap="small">
                {title ? <s-heading>{title}</s-heading> : null}
                {titleMetadata}
              </s-stack>

              {(backAction || primaryAction) && (
                <s-button-group>
                  {backAction ? (
                    <s-button onClick={backAction.onAction}>
                      {backAction.content}
                    </s-button>
                  ) : null}
                  {primaryAction ? (
                    <s-button
                      onClick={primaryAction.onAction}
                      tone={primaryAction.tone}
                      variant="primary"
                    >
                      {primaryAction.content}
                    </s-button>
                  ) : null}
                </s-button-group>
              )}
            </s-grid>
          </s-section>
        )}

        <s-section>{children}</s-section>

        {pagination ? (
          <s-section>
            <s-stack direction="inline" gap="base" justifyContent="space-between">
              <s-button disabled={!pagination.hasPrevious} onClick={pagination.onPrevious}>
                Previous
              </s-button>
              <s-button disabled={!pagination.hasNext} onClick={pagination.onNext}>
                Next
              </s-button>
            </s-stack>
          </s-section>
        ) : null}

        <s-section>
          <s-stack alignItems="center">
            <s-text>
              Powered by{" "}
              <a href="https://gadget.dev" rel="noreferrer" target="_blank">
                Gadget
              </a>
            </s-text>
          </s-stack>
        </s-section>
      </s-page>
  );
}
