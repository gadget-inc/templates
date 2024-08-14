import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Switch,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  Flex,
  Text,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { api } from "../api";
import { useAction, useFindMany } from "@gadgetinc/react";
import {
  AutoForm,
  AutoButton,
  AutoBooleanInput,
  AutoBelongsToInput,
  AutoTextInput,
  AutoInput,
  AutoSubmit,
} from "@gadgetinc/react/auto/polaris";
import {
  InlineStack,
  ButtonGroup,
  Card,
  BlockStack,
  Tooltip,
} from "@shopify/polaris";

export default () => {
  // state for the post being edited
  const [postToEdit, setPostToEdit] = useState(null);
  // state for error messages
  const [errorMessage, setErrorMessage] = useState(null);

  // the useFindMany hook reads all posts
  const [
    { data: postList, fetching: fetchingPosts, error: errorFetchingPosts },
  ] = useFindMany(api.post, {
    live: true,
  });

  // the `changePublishState' function updates the isPublished field of a post when the frontend toggle for that post is clicked
  const [{ fetching: isPublishing, error: publishError }, changePublishState] =
    useAction(api.post.update);

  // paste latest error message in a banner
  useEffect(() => {
    setErrorMessage(publishError?.message || errorFetchingPosts?.message);
  }, [errorFetchingPosts, publishError]);

  // toggle the isPublished field of a post by updating the record
  const changePublished = async (id, currentState) => {
    await changePublishState({
      id,
      post: {
        isPublished: !currentState,
      },
    });
  };

  return (
    <Container maxW="100vw" py="40px">
      <Flex>
        <Container maxW="25%">
          <Stack>
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" fontSize="lg" flexGrow="1">
                Posts
              </Text>
              <Button
                onClick={() => setPostToEdit(null)}
                colorScheme="blue"
                variant="outline"
                size="sm"
              >
                New
              </Button>
            </InlineStack>
            {fetchingPosts ? (
              <Spinner />
            ) : (
              <Box m="4px" maxWidth="300px">
                {errorMessage && (
                  <Alert status="error">
                    <AlertIcon />
                    {errorMessage}
                  </Alert>
                )}
                {postList?.map(({ id, isPublished, title }, index) => (
                  <Flex
                    key={index}
                    gap="2"
                    alignItems="center"
                    p="10px"
                    background={postToEdit === id ? "whitesmoke" : "white"}
                    borderRadius="4px"
                  >
                    <Tooltip
                      content={isPublished ? "Unpublish" : "Publish"}
                      hoverDelay={500}
                    >
                      <Switch
                        isChecked={isPublished}
                        onChange={async () =>
                          await changePublishState({
                            id: id,
                            post: {
                              isPublished: !isPublished,
                            },
                          })
                        }
                        disabled={isPublishing}
                      />
                    </Tooltip>
                    <Text fontSize="md" flexGrow="1">
                      {title}
                    </Text>
                    <Tooltip content="Edit post" hoverDelay={500}>
                      <IconButton
                        variant="link"
                        icon={<EditIcon />}
                        onClick={() => setPostToEdit(id)}
                      />
                    </Tooltip>
                    <Tooltip content="Delete post" hoverDelay={500}>
                      <AutoButton
                        action={api.post.delete}
                        icon={<DeleteIcon />}
                        onSuccess={() => {
                          if (postToEdit === id) {
                            setPostToEdit(null);
                          }
                        }}
                        variables={{ id }}
                        tone="critical"
                        variant="plain"
                        children=""
                      />
                    </Tooltip>
                  </Flex>
                ))}
              </Box>
            )}
          </Stack>
        </Container>
        <Container flexGrow="1" maxW="70vw">
          <AutoForm
            action={postToEdit ? api.post.update : api.post.create}
            defaultValues={
              postToEdit
                ? null
                : { title: "", content: "Start writing your blog post here!" }
            }
            findBy={postToEdit ? postToEdit : null}
            onSuccess={() => {
              setPostToEdit(null);
            }}
            children={
              <Card>
                <BlockStack gap="300">
                  <AutoTextInput field="title" />
                  <AutoBelongsToInput field="user" />
                  <AutoBooleanInput field="isPublished" />
                  <AutoInput field="content" />
                  <InlineStack align="end">
                    <ButtonGroup>
                      <AutoSubmit />
                    </ButtonGroup>
                  </InlineStack>
                </BlockStack>
              </Card>
            }
          />
        </Container>
      </Flex>
    </Container>
  );
};
