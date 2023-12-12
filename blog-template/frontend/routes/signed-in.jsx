import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Switch,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { api } from "../api";
import {
  useAction,
  useFindMany,
  useUser,
  useActionForm,
} from "@gadgetinc/react";

export default function () {
  const [publishingBlog, setPublishingBlog] = useState("");

  const {
    submit,
    register,
    formState: { isSubmitSuccessful, isSubmitting },
    error: addPostError,
    setValue,
    getValues,
  } = useActionForm(api.post.create, {
    defaultValues: {
      title: "",
      postBody: "",
      content: "",
    },
    send: ["title", "content", "user"],
  });

  // the useUser hook grabs the user record from the Gadget API
  // this is used to display the user's avatar in the UI
  const user = useUser(api);
  useEffect(() => {
    setValue("user", {
      _link: user.id,
    });
  }, [user]);

  // the useFindMany hook reads all posts
  const [{ data: postList }] = useFindMany(api.post);

  // the `changePublishState' function updates the isPublished field of a post when the frontend toggle for that post is clicked
  const [{ fetching: isPublishing, error: publishError }, changePublishState] = useAction(
    api.post.update
  );

  // submit the form
  const handleSave = async (event) => {
    event.preventDefault();

    // reformat the content field to be a markdown field
    setValue("content", {
      markdown: getValues("postBody"),
    });
    await submit();
  };

  // toggle the isPublished field of a post by updating the record
  const changePublished = async (id, currentState) => {
    setPublishingBlog(id);

    await changePublishState({
      id,
      post: {
        isPublished: !currentState,
      },
    });

    setPublishingBlog("");
  };

  return (
    <Container maxW="5xl" py="15">
      <Tabs>
        <TabList>
          <Tab>Write</Tab>
          <Tab>Publish</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box mt="5" textAlign="left">
              {addPostError && (
                <Alert status="error">
                  <AlertIcon />
                  <code>{addPostError.message}</code>
                </Alert>
              )}
              {isSubmitSuccessful && (
                <Alert status="success">
                  <AlertIcon />
                  Blog post created!
                </Alert>
              )}
              {isSubmitting && <Spinner />}
              <form onSubmit={handleSave}>
                <FormControl>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Input type="text" {...register("title")} />
                  <FormLabel htmlFor="content" pt="16px">
                    Content
                  </FormLabel>
                  <Textarea
                    size="sm"
                    resize="vertical"
                    {...register("postBody")}
                  />
                </FormControl>
                <Button colorScheme="blue" mt={4} type="submit">
                  Save
                </Button>
              </form>
            </Box>
          </TabPanel>

          <TabPanel>
            <Text>Select what blog posts you want visible to the public.</Text>
            <Box mt={8} maxWidth="300px" p="4px">
              {publishError && (
                <Alert status="error">
                  <AlertIcon />
                  Publishing error!
                </Alert>
              )}
              {postList?.map((post, index) => (
                <Box key={index}>
                  <Flex gap="2" align="center">
                    <Switch
                      isChecked={post.isPublished}
                      onChange={() =>
                        changePublished(post.id, post.isPublished)
                      }
                      disabled={isPublishing && publishingBlog === post.id}
                    />
                    <Text fontSize="md">{post.title}</Text>
                  </Flex>
                </Box>
              ))}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
