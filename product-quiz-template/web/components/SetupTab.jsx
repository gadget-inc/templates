import {
  Text,
  Button,
  Spinner,
  BlockStack,
  Card,
  InlineGrid,
  InlineStack,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useFindMany, useAction, useFindFirst } from "@gadgetinc/react";
import { api } from "../api";
import { useCallback } from "react";
import { useState } from "react";
import { PageTemplate } from "./PageTemplate";

export function SetupTab() {
  const navigate = useNavigate();

  const [storeResponse] = useFindFirst(api.shopifyShop, {
    select: {
      __typename: true,
      id: true,
      themes: {
        edges: {
          node: {
            usingOnlineStore2: true,
          },
        },
      },
    },
  });

  const [quizResponse] = useFindMany(api.quiz, {
    select: {
      __typename: true,
      id: true,
      title: true,
      body: true,
      slug: true,
    },
  });

  const [markedForDelete, setMarkedForDelete] = useState(null);
  const [_, deleteQuiz] = useAction(api.quiz.delete);
  const deleteExistingQuiz = useCallback(async (quizId) => {
    setMarkedForDelete(quizId);
    await deleteQuiz({ id: quizId });
  }, []);

  const onCreateNewQuiz = () => {
    navigate("/create-quiz");
  };

  const onEditQuiz = (id) => {
    navigate(`/edit-quiz/${id}`);
  };

  if (quizResponse.fetching || storeResponse.fetching) {
    return (
      <PageTemplate>
        <BlockStack alignment="center">
          <Spinner /> <span>Loading...</span>
        </BlockStack>
      </PageTemplate>
    );
  }

  return (
    <BlockStack gap="500">
      <BlockStack inlineAlign="end">
        <Button size="large" primary onClick={() => onCreateNewQuiz()}>
          Create new quiz
        </Button>
      </BlockStack>

      {quizResponse.data?.length > 0 ? (
        quizResponse.data?.map((quiz, i) => {
          const isDeleting = markedForDelete === quiz.id;
          return (
            <Card key={i} sectioned subdued>
              <InlineGrid columns={["twoThirds", "oneThird"]} gap="200">
                {isDeleting ? (
                  <BlockStack inlineAlign="center">
                    <Spinner /> <span>Deleting...</span>
                  </BlockStack>
                ) : (
                  <BlockStack>
                    <InlineStack gap="200">
                      <Text variant="headingMd" as="h2">
                        {quiz.title}
                      </Text>
                      <Text variant="bodyXs" as="p" tone="subdued">
                        {quiz.slug}
                      </Text>
                    </InlineStack>
                    <Text as="p">{quiz.body}</Text>
                  </BlockStack>
                )}

                <BlockStack gap="200">
                  <Button
                    disabled={isDeleting}
                    onClick={() => {
                      onEditQuiz(quiz.id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    destructive
                    disabled={isDeleting}
                    onClick={() => {
                      deleteExistingQuiz(quiz.id);
                    }}
                  >
                    Delete
                  </Button>
                </BlockStack>
              </InlineGrid>
            </Card>
          );
        })
      ) : (
        <Card>
          <BlockStack inlineAlign="center">
            <p>No quizzes created</p>
          </BlockStack>
        </Card>
      )}
    </BlockStack>
  );
}
