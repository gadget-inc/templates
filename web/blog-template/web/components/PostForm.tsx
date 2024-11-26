import "@mdxeditor/editor/style.css";
import { MDXEditor } from "@mdxeditor/editor/MDXEditor";
import { markdownShortcutPlugin, MDXEditorMethods } from "@mdxeditor/editor";
import { headingsPlugin } from "@mdxeditor/editor/plugins/headings";
import { listsPlugin } from "@mdxeditor/editor/plugins/lists";
import { quotePlugin } from "@mdxeditor/editor/plugins/quote";
import { UndoRedo } from "@mdxeditor/editor/plugins/toolbar/components/UndoRedo";
import { BoldItalicUnderlineToggles } from "@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles";
import { toolbarPlugin } from "@mdxeditor/editor/plugins/toolbar";
import { useEffect, useRef } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Container,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { api } from "../api";
import { useUser, useActionForm, Controller } from "@gadgetinc/react";
import type { PostToEdit } from "../routes/signed-in";

export default ({ postToEdit }: { postToEdit: PostToEdit }) => {
  // the useUser hook grabs the user record from the Gadget API
  // this is used to display the user's avatar in the UI
  const user = useUser(api);

  // form state, used to submit to the backend API
  const {
    submit,
    register,
    formState: { isSubmitting },
    error: addPostError,
    setValue,
    getValues,
    control,
    reset,
  } = useActionForm(postToEdit ? api.post.update : api.post.create, {
    defaultValues: {
      title: "",
      content: "Start writing your blog post here!" as
        | string
        | {
            markdown:
              | string
              | (string & { markdown: string | null | undefined });
          },
      userId: user?.id,
    },
  });

  // a Chakra UI toast
  const toast = useToast();

  // reference to the MDXEditor component, required for dynamic updates
  let editorRef = useRef<MDXEditorMethods | null>(null);

  // function to reset the editor to a fresh state
  function resetEditor() {
    editorRef.current?.setMarkdown("Start writing your blog post here!");
    setValue("userId", user.id);
    reset();
  }

  // handle dynamic form values when working with MDXEditor
  useEffect(() => {
    // reset the form when the postToEdit prop changes
    reset();

    // if there is a post to edit, hydrate the form and editor state
    if (postToEdit) {
      editorRef.current?.setMarkdown(postToEdit?.content?.markdown || "");
      setValue("content", postToEdit?.content?.markdown || "");
      setValue("title", postToEdit.title);
      setValue("id", postToEdit.id);
      setValue("userId", user.id);
    } else {
      // otherwise, reset to a fresh state
      resetEditor();
    }
  }, [postToEdit]);

  // submit the form
  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // replace all newlines with <br /> tags for markdown compatibility
    const content = getValues("content");
    if (typeof content == "string") {
      content?.replace(/\n/g, "<br />");

      // reformat the content field to be a markdown field
      setValue("content", {
        markdown: content,
      });
    }

    // submit the form, save the post!
    await submit();
    if (!postToEdit) {
      resetEditor();
    }

    // use a toast to inform users of a successful action
    toast({
      title: `Post ${postToEdit ? "updated" : "created"}!`,
      status: "success",
      isClosable: true,
    });
  };

  return (
    <>
      {addPostError && (
        <Alert status="error">
          <AlertIcon />
          <code>{addPostError.message}</code>
        </Alert>
      )}
      <Heading marginBottom="20px">
        {postToEdit ? `Editing post` : "Writing new post"}
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
                      markdownShortcutPlugin(),
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
        <Button
          colorScheme="blue"
          mt={4}
          type="submit"
          isLoading={isSubmitting}
        >
          Save
        </Button>
      </form>
    </>
  );
};
