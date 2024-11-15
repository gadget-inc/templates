import { useState, useRef, useCallback, useEffect } from "react";
import {
  Flex,
  Button,
  Textarea,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SendIcon } from "./icons/SendIcon";
import { LoadingIcon } from "./icons/LoadingIcon";
import { useChat } from "../hooks/useChat";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const textAreaRef = useRef(null);
  const {
    currentChat,
    startChat,
    nameChat,
    addMessage,
    respondToMessage,
    streamingResponse,
  } = useChat();

  const hasInput = !!input;
  const sendingDisabled = sendingMessage || streamingResponse;

  const sendMessage = useCallback(async () => {
    if (sendingDisabled) return;

    setSendingMessage(true);

    try {
      const message = addMessage("user", input);
      setInput("");

      let chat = currentChat;
      if (!chat) {
        chat = await startChat();
        nameChat(chat, message);
      }

      await respondToMessage(chat, message);
    } catch (error) {
      console.log("error sending message: ", error);
    }

    setSendingMessage(false);
  }, [input, setInput, sendingDisabled]);

  useEffect(() => {
    if (!currentChat) {
      textAreaRef.current.focus();
    }
  }, [currentChat]);

  return (
    <Flex py={4} px={16} alignSelf="stretch">
      <InputGroup size="md">
        <Textarea
          ref={textAreaRef}
          color="white"
          placeholder="Send a message"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);

            const textarea = textAreaRef.current;
            textarea.style.height = `${textarea.scrollHeight}px`;
          }}
          resize="none"
          minHeight="40px"
          overflowY="hidden"
          onKeyDown={async (event) => {
            if (event.key === "Enter" && !event.shiftKey && !sendingDisabled) {
              event.preventDefault(); // Prevents the default behavior (newline) when Enter is pressed.
              await sendMessage();
            }
          }}
        />
        <InputRightElement
          height="full"
          display="flex"
          alignItems="center"
          px={2}
        >
          {sendingMessage || streamingResponse ? (
            <LoadingIcon />
          ) : (
            <Button
              disabled={!hasInput || sendingDisabled}
              color={hasInput ? "white" : "gray.500"}
              p={1}
              bgColor={hasInput ? "purple.500" : undefined}
              cursor={hasInput ? "pointer" : "default"}
              borderRadius="md"
              onClick={sendMessage}
              variant="link"
            >
              <SendIcon />
            </Button>
          )}
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default ChatInput;
