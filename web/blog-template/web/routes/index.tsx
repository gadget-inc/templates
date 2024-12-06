import { useEffect, useState } from "react";
import { useFindMany } from "@gadgetinc/react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Text,
  Collapse,
  Container,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { api } from "../api";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";

export default () => {
  const [displayPosts, setDisplayPosts] = useState<
    {
      id: string;
      show: boolean;
      title: string;
      updatedAt: Date;
      content: { markdown: string };
    }[]
  >([]);

  // the useFindMany hook is used to read blog posts from the backend API
  const [{ data: posts, fetching, error }] = useFindMany(api.post, {
    sort: {
      updatedAt: "Descending",
    },
  });

  // set the React state when the posts are loaded from the useFindMany read request
  // a "show" property is added to each post to track whether the post should be expanded or collapsed
  useEffect(() => {
    if (posts) {
      setDisplayPosts(
        posts.map((post) => ({
          ...post,
          show: false,
          content: post.content ?? { markdown: "" },
        }))
      );
    }
  }, [posts]);

  // toggle post visibility
  const toggleShow = (id: string) => {
    setDisplayPosts(
      displayPosts.map((post) =>
        post.id === id ? { ...post, show: !post.show } : post
      )
    );
  };

  return (
    <Container maxW="90vw" py="15">
      <Box mt="5" textAlign="left">
        {error && (
          <Alert status="error">
            <AlertIcon />
            Error loading posts
          </Alert>
        )}
        {(!displayPosts || fetching) && <Spinner />}
        {displayPosts.map((post) => (
          <Box
            key={post.id}
            mt="5"
            p="5"
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
          >
            <Flex align="center" justify="space-between">
              <Text fontSize="2xl" mb="4">
                {post.title}
              </Text>
              <Text fontSize="l" mb="4">
                {post.updatedAt.toDateString()}
              </Text>
            </Flex>
            <Collapse in={post.show}>
              <ReactMarkdown
                components={ChakraUIRenderer()}
                children={post?.content?.markdown}
                skipHtml
              />
            </Collapse>
            <Button size="sm" onClick={() => toggleShow(post.id)}>
              {post.show ? "Hide post" : "Read post"}
            </Button>
          </Box>
        ))}
        {!fetching && !displayPosts.length && (
          <Text
            fontSize="2xl"
            mb="4"
            mt="100"
            style={{
              width: "100%",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            No blog posts yet!
            <Link to="/sign-up">
              <Button>Sign up to create a post</Button>
            </Link>
          </Text>
        )}
      </Box>
    </Container>
  );
};
