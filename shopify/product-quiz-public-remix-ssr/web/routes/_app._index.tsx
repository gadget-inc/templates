import {
  Layout,
  Card,
  Button,
  InlineStack,
  Text,
  BlockStack,
  Box,
  Banner,
  SkeletonDisplayText,
  SkeletonBodyText,
} from "@shopify/polaris";
import { useAction, useTable } from "@gadgetinc/react";
import { api } from "../api";
import PageLayout from "../components/PageLayout";
import { useNavigate } from "@remix-run/react";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";

type QuizCardProps = {
  quiz: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
  };
};

/**
 * @returns {JSX.Element} - A card component that displays a message when no quizzes are found, with an option to create a new quiz.
 */
function NoData() {
  const navigate = useNavigate();

  return (
    <Card>
      <Box padding="600">
        <InlineStack align="center">
          <BlockStack gap="300">
            <Text as="p" tone="subdued">
              No quizzes found. Create one to get started.
            </Text>
            <InlineStack>
              <Button variant="primary" onClick={() => navigate("/quiz")}>
                Create a quiz
              </Button>
            </InlineStack>
          </BlockStack>
        </InlineStack>
      </Box>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card>
      <BlockStack gap="300">
        <SkeletonDisplayText />
        <SkeletonBodyText />
      </BlockStack>
    </Card>
  );
}

/**
 *
 * @param props - Data related to a quiz, including its id, title, slug, and description.
 * @returns {JSX.Element} - A card component displaying the quiz title, slug, and description, with options to edit or delete the quiz.
 */
function QuizCard(props: QuizCardProps) {
  const {
    quiz: { id, title, slug, description },
  } = props;

  const navigate = useNavigate();

  const [{ fetching, error }, deleteQuiz] = useAction(api.quiz.delete);

  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between">
          <Text as="h2" variant="headingMd" fontWeight="bold">
            {title}
          </Text>
          <InlineStack gap="300">
            <Button
              variant="tertiary"
              icon={EditIcon}
              onClick={() => navigate(`/quiz/${id}`)}
            />
            <Button
              variant="tertiary"
              tone="critical"
              icon={DeleteIcon}
              loading={fetching}
              disabled={fetching}
              onClick={() => deleteQuiz({ id })}
            />
          </InlineStack>
        </InlineStack>
        <Text as="p" tone="subdued">
          {description || "No description provided"}
        </Text>
        <Text as="p" variant="bodySm" tone="subdued">
          Quiz ID
        </Text>
        <Box padding="200" background="bg-surface-tertiary" borderRadius="200">
          <Text as="p" variant="bodySm">
            {slug}
          </Text>
        </Box>
      </BlockStack>
    </Card>
  );
}

/**
 *
 * @returns {JSX.Element} The main index page for quizzes, displaying a list of quizzes with options to create, edit, or delete them.
 */
export default function Index() {
  const [dismissed, setDismissed] = useState(false);

  const navigate = useNavigate();

  const [{ data, error, fetching }] = useTable(api.quiz, {
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
    },
  });

  const handleDismiss = useCallback(() => {
    setDismissed((prev) => !prev);
    // Suggestion: Add a permanent flag to the database to persist the dismissal
  }, [setDismissed]);

  return (
    <PageLayout
      title="Quizzes"
      primaryAction={{ content: "New", url: "/quiz" }}
      secondaryActions={
        <Button onClick={() => navigate("/install")}>Install</Button>
      }
    >
      {!dismissed && (
        <Layout.Section>
          <Banner
            title="Install your app extension"
            onDismiss={() => handleDismiss()}
          >
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">
                Run <code>yarn shopify:dev</code>, in the Gadget terminal, to
                run your extension. Then install it on your store's theme to
                start using the app.
              </Text>
              <InlineStack>
                <Button onClick={() => navigate("/install")}>
                  Installation guide
                </Button>
              </InlineStack>
            </BlockStack>
          </Banner>
        </Layout.Section>
      )}
      {error && !fetching && (
        <Layout.Section>
          <Banner title="Uh oh! Something went wrong" tone="critical">
            <Text as="p">
              There was an error loading your quizzes. Please try again later.
            </Text>
          </Banner>
        </Layout.Section>
      )}
      <Layout.Section>
        <BlockStack gap="300">
          {/* Loading state */}
          {!data && fetching && <LoadingState />}
          {data?.map((quiz, i) => <QuizCard key={i} {...{ quiz }} />)}
          {/* No data state */}
          {!data?.length && !fetching && <NoData />}
          {/* Error state */}
        </BlockStack>
      </Layout.Section>
    </PageLayout>
  );
}
