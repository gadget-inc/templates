import "@mdxeditor/editor/style.css";
import { useState, useEffect, useRef } from "react";
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
  Text,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { api } from "../api";
import {
  useAction,
  useFindMany,
  useUser,
  useActionForm,
  Controller,
} from "@gadgetinc/react";
import { MDXEditor } from "@mdxeditor/editor/MDXEditor";
import { headingsPlugin } from "@mdxeditor/editor/plugins/headings";
import { listsPlugin } from "@mdxeditor/editor/plugins/lists";
import { quotePlugin } from "@mdxeditor/editor/plugins/quote";
import { UndoRedo } from "@mdxeditor/editor/plugins/toolbar/components/UndoRedo";
import { BoldItalicUnderlineToggles } from "@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles";
import { toolbarPlugin } from "@mdxeditor/editor/plugins/toolbar";

const PostForm = ({ postToEdit }) => {
  const {
    submit,
    register,
    formState: { isSubmitSuccessful, isSubmitting },
    error: addPostError,
    setValue,
    getValues,
    control,
    reset,
  } = useActionForm(postToEdit ? api.post.update : api.post.create, {
    defaultValues: {
      title: "",
      content: "Start writing your blog post here!",
    },
  });

  let editorRef = useRef(null);

  // the useUser hook grabs the user record from the Gadget API
  // this is used to display the user's avatar in the UI
  const user = useUser(api);

  // handle dynamic form values when working with MDXEditor
  useEffect(() => {
    // reset the form when the postToEdit prop changes
    reset();

    // if there is a post to edit, hydrate the form and editor state
    if (postToEdit) {
      editorRef.current.setMarkdown(postToEdit?.content?.markdown);
      setValue("content", postToEdit?.content?.markdown);
      setValue("title", postToEdit.title);
      setValue("id", postToEdit.id);
      setValue("user", {
        _link: user.id,
      });
    } else {
      // otherwise, reset to a fresh state
      editorRef.current.setMarkdown("Start writing your blog post here!");
      setValue("user", {
        _link: user.id,
      });
    }
  }, [postToEdit]);

  // submit the form
  const handleSave = async (event) => {
    event.preventDefault();

    // replace all newlines with <br /> tags for markdown compatibility
    const content = getValues("content");
    if (!content.markdown) {
      content.replaceAll("\n", "<br />");

      // reformat the content field to be a markdown field
      setValue("content", {
        markdown: content,
      });
    }

    // submit the form, save the post!
    await submit();
  };

  return (
    <>
      {addPostError && (
        <Alert status="error">
          <AlertIcon />
          <code>{addPostError.message}</code>
        </Alert>
      )}
      {isSubmitSuccessful && (
        <Alert status="success">
          <AlertIcon />
          {postToEdit ? "Post updated!" : "Blog post created!"}
        </Alert>
      )}
      {isSubmitting && <Spinner />}
      <Heading marginBottom="20px">
        {postToEdit
          ? `Editing post: ${postToEdit.title}`
          : "Writing new blog post"}
      </Heading>
      <form onSubmit={handleSave}>
        <FormControl>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input type="text" {...register("title")} />
          <FormLabel htmlFor="content" pt="16px">
            Content
          </FormLabel>
          <Container border="1px dashed lightgrey" maxW="100%" p="8px">
            <Controller
              name="content"
              control={control}
              render={({ field }) => {
                const { ref, ...fieldProps } = field;
                return (
                  <MDXEditor
                    ref={editorRef}
                    markdown={""}
                    plugins={[
                      headingsPlugin(),
                      listsPlugin(),
                      quotePlugin(),
                      toolbarPlugin({
                        toolbarContents: () => (
                          <>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                          </>
                        ),
                      }),
                    ]}
                    {...fieldProps}
                  />
                );
              }}
            />
          </Container>
        </FormControl>
        <Button colorScheme="blue" mt={4} type="submit">
          Save
        </Button>
      </form>
    </>
  );
};

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
    <Container maxW="6xl" py="15">
      <Flex>
        <Container w="25%">
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
                    variant="outline"
                    icon={<EditIcon />}
                    onClick={() => setPostToEdit(post)}
                    isDisabled={isDeleting && dirtyPost === post.id}
                  />
                  <IconButton
                    variant="outline"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={async () => {
                      setDirtyPost(post.id);
                      await deletePost({ id: post.id });
                    }}
                    isDisabled={isDeleting && dirtyPost === post.id}
                  />
                </Flex>
              ))}
            </Box>
          )}
        </Container>
        <Container flexGrow="1">
          <PostForm postToEdit={postToEdit} />
        </Container>
      </Flex>
    </Container>
  );
}
