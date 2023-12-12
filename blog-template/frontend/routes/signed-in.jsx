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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { api } from "../api";
import { useAction, useFindMany } from "@gadgetinc/react";

import { PostForm } from "../components/PostForm";

export default function () {
  // state for the post that is being published
  const [dirtyPost, setDirtyPost] = useState("");
  // state for the post being edited
  const [postToEdit, setPostToEdit] = useState(null);
  // state for error messages
  const [errorMessage, setErrorMessage] = useState(null);

  // the useFindMany hook reads all posts
  const [
    { data: postList, fetching: fetchingPosts, error: errorFetchingPosts },
  ] = useFindMany(api.post);

  // the `changePublishState' function updates the isPublished field of a post when the frontend toggle for that post is clicked
  const [{ fetching: isPublishing, error: publishError }, changePublishState] =
    useAction(api.post.update);
  const [{ fetching: isDeleting, error: deleteError }, deletePost] = useAction(
    api.post.delete
  );

  // paste latest error message in a banner
  useEffect(() => {
    setErrorMessage(
      publishError?.message ||
        deleteError?.message ||
        errorFetchingPosts?.message
    );
  }, [errorFetchingPosts, publishError, deleteError]);

  // toggle the isPublished field of a post by updating the record
  const changePublished = async (id, currentState) => {
    setDirtyPost(id);

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
          <Button
            marginBottom="24px"
            onClick={() => setPostToEdit(null)}
            colorScheme="blue"
            variant="outline"
          >
            Write a new post
          </Button>
          <Text>Select a post to edit.</Text>
          <Text>Toggle switch to publish.</Text>
          <Text>Delete button to... delete.</Text>
          {fetchingPosts ? (
            <Spinner />
          ) : (
            <Box mt="4px" maxWidth="300px" p="4px">
              {errorMessage && (
                <Alert status="error">
                  <AlertIcon />
                  {errorMessage}
                </Alert>
              )}
              {postList?.map((post, index) => (
                <Flex
                  key={index}
                  gap="2"
                  alignItems="center"
                  p="4px"
                  background={
                    postToEdit?.id === post.id ? "whitesmoke" : "white"
                  }
                  borderRadius="4px"
                >
                  <Switch
                    isChecked={post.isPublished}
                    onChange={() => changePublished(post.id, post.isPublished)}
                    disabled={
                      (isPublishing || isDeleting) && dirtyPost === post.id
                    }
                  />
                  <Text fontSize="md" flexGrow="1">
                    {post.title}
                  </Text>
                  <IconButton
                    variant="link"
                    icon={<EditIcon />}
                    onClick={() => setPostToEdit(post)}
                    isDisabled={isDeleting && dirtyPost === post.id}
                  />
                  <IconButton
                    variant="link"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={async () => {
                      setDirtyPost(post.id);
                      await deletePost({ id: post.id });

                      if (postToEdit.id === post.id) {
                        setPostToEdit(null);
                      }
                    }}
                    isDisabled={isDeleting && dirtyPost === post.id}
                  />
                </Flex>
              ))}
            </Box>
          )}
        </Container>
        <Container flexGrow="1" maxW="70vw">
          <PostForm postToEdit={postToEdit} />
        </Container>
      </Flex>
    </Container>
  );
}
