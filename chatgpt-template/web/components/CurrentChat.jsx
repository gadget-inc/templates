import { useRef, useCallback, useEffect, useState } from "react";
import { ChatGPTIcon } from "./icons/ChatGPTIcon";
import { Flex, Text, Image, Box, Link } from "@chakra-ui/react";
import { useChat } from "../hooks/useChat";
import ChatInput from "./ChatInput";

const Message = (props) => {
  const { content, role, icon } = props
  return (
    <Flex bgColor={role === "assistant" ? "gray.600" : undefined} justifyContent={"center"}>
      <Flex px={8} py={8} gap={4} maxWidth={800} width={"100%"}>
      {icon}
      <Flex flex="1">
        <Text color="white">
          {content}
        </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

const CurrentChat = (props) => {
  const { user } = props;
  const { messages, response, streamingResponse } = useChat();
  const scrollRef = useRef(null);
  const [stickToBottom, setStickToBottom] = useState(true);

  const onScroll = useCallback(() => {
    const container = scrollRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;

      if (isAtBottom && !stickToBottom) {
        setStickToBottom(true)
      } else if (!isAtBottom && stickToBottom) {
        setStickToBottom(false)
      }
    }
  }, [stickToBottom, setStickToBottom]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;

      if (!isAtBottom && stickToBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, stickToBottom, response, streamingResponse])

  return (
    <Flex direction="column" flex="1" overflowY="auto" position="relative" ref={scrollRef} onScroll={onScroll}>
      {messages.map((message) => (
        <Message
          key={message.id}
          content={message.content}
          role={message.role}
          icon={message.role === "user" ? <Image src={user.googleImageUrl} boxSize={8}/> : <ChatGPTIcon />}
        />
      ))}
      {streamingResponse && <Message content={response} role={"assistant"} icon={<ChatGPTIcon />} />}
      <Box position="sticky" marginTop="auto" bottom={0} bgColor="gray.700">
        <Flex direction="column" py={2} alignItems="center" gap={3}>
          <ChatInput />
          <Text fontSize="xs" color="gray.500">This is a ChatGPT clone built in 30 minutes with <Link color="white" href="https://gadget.dev" isExternal>gadget.dev</Link></Text>
        </Flex>
      </Box>
    </Flex>
  )
}

export default CurrentChat;
