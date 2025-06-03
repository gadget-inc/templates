import {
  Layout,
  Card,
  Button,
  InlineStack,
  Text,
  BlockStack,
  ButtonGroup,
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

type QuizCardProps = {
  quiz: {
    id: string;
    title: string;
    slug: string;
    body: string | null;
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
 * @param props - Data related to a quiz, including its id, title, slug, and body.
 * @returns {JSX.Element} - A card component displaying the quiz title, slug, and body, with options to edit or delete the quiz.
 */
function QuizCard(props: QuizCardProps) {
  const {
    quiz: { id, title, slug, body },
  } = props;

  const navigate = useNavigate();

  const [{ fetching }, deleteQuiz] = useAction(api.quiz.delete);

  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between">
          <BlockStack>
            <Text as="h2" variant="headingMd">
              {title}
            </Text>
            <Text as="p" tone="subdued">
              {slug}
            </Text>
          </BlockStack>
          <ButtonGroup>
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
          </ButtonGroup>
        </InlineStack>
        <Text as="p">{body}</Text>
      </BlockStack>
    </Card>
  );
}

/**
 *
 * @returns {JSX.Element} The main index page for quizzes, displaying a list of quizzes with options to create, edit, or delete them.
 */
export default function Index() {
  const navigate = useNavigate();
  const [{ data, error, fetching }] = useTable(api.quiz, {
    select: {
      id: true,
      title: true,
      slug: true,
      body: true,
    },
  });

  return (
    <PageLayout
      title="Quizzes"
      primaryAction={{ content: "New", url: "/quiz" }}
      secondaryActions={
        <Button onClick={() => navigate("/install")}>Install</Button>
      }
    >
      <Layout.Section>
        <BlockStack gap="300">
          {/* Loading state */}
          {!data && fetching && <LoadingState />}
          {data?.map((quiz, i) => <QuizCard key={i} {...{ quiz }} />)}
          {/* No data state */}
          {!data?.length && !fetching && <NoData />}
          {/* Error state */}
          {error && !fetching && (
            <Banner title="Uh oh! Something went wrong" tone="critical">
              <Text as="p">
                There was an error loading your quizzes. Please try again later.
              </Text>
            </Banner>
          )}
        </BlockStack>
      </Layout.Section>
    </PageLayout>
  );
}
