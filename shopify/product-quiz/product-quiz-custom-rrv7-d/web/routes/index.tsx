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
import { useNavigate } from "react-router";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";

type QuizCardProps = {
  quiz: {
    id: string;
    title: string;
    slug: string;
    body: string | null;
  };
};

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

export function IndexPage() {
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
