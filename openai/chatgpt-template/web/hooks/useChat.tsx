import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { useFetch } from "@gadgetinc/react";
import { api } from "../api";
import { nanoid } from "nanoid";
import { orderBy } from "lodash";
import { Chat, GadgetRecord, Message } from "@gadget-client/chatgpt-template";

type Reducer = {
  chats: ChatSubset[] | undefined | null;
  currentChat: ChatSubset | null;
  messages: MessageSubset[];
};

type AddMessage = {
  payload: MessageSubset;
  type: "addMessage";
};

type DeleteChat = {
  payload: ChatSubset;
  type: "deleteChat";
};

type UpdateChat = {
  payload: ChatSubset;
  type: "updateChat";
};

type AddChat = {
  payload: ChatSubset;
  type: "addChat";
};

type SetCurrentChat = {
  payload: ChatSubset | null;
  type: "setCurrentChat";
};

type SetMessages = {
  payload: MessageSubset[];
  type: "setMessages";
};

type SetChats = {
  payload: ChatSubset[];
  type: "setChats";
};

type Action =
  | AddMessage
  | SetChats
  | SetMessages
  | SetCurrentChat
  | AddChat
  | UpdateChat
  | DeleteChat;

export type ChatSubset = Pick<
  Chat,
  "id" | "name" | "createdAt" | "userId" | "updatedAt" | "__typename"
>;

type MessageSubset = Pick<Message, "id" | "order" | "role" | "content">;

export type ChatContextType = {
  chats: ChatSubset[] | undefined | null;
  currentChat: ChatSubset | null;
  messages: MessageSubset[];
  selectChat: (chat: ChatSubset) => Promise<void>;
  startChat: () => Promise<ChatSubset>;
  nameChat: (chat: ChatSubset, message: MessageSubset) => void;
  clearChat: () => void;
  respondToMessage: (chat: ChatSubset, message: MessageSubset) => Promise<void>;
  deleteChat: (chat: ChatSubset) => Promise<void>;
  addMessage: (
    role: MessageSubset["role"],
    content: MessageSubset["content"]
  ) => MessageSubset;
  response: any;
  streamingResponse: boolean;
};

const ChatContext = createContext<ChatContextType | null>(null);

const reducer = (state: Reducer, action: Action) => {
  if (action?.type === "setChats") {
    return { ...state, chats: action.payload };
  } else if (action?.type === "setMessages") {
    return { ...state, messages: action.payload };
  } else if (action?.type === "addMessage") {
    return { ...state, messages: [...state.messages, action.payload] };
  } else if (action?.type === "setCurrentChat") {
    return { ...state, currentChat: action.payload };
  } else if (action?.type === "addChat") {
    const chats = orderBy(
      [...(state.chats ?? []), action.payload],
      "createdAt",
      "desc"
    );
    return { ...state, chats };
  } else if (action?.type === "updateChat") {
    const otherChats = state.chats?.filter(
      (chat) => chat.id !== action.payload.id
    );
    const chats = orderBy(
      [...(otherChats ?? []), action.payload],
      "createdAt",
      "desc"
    );
    return { ...state, chats };
  } else if (action?.type === "deleteChat") {
    const chats = state.chats?.filter((chat) => chat.id !== action.payload.id);
    return { ...state, chats };
  }

  return state;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer<React.Reducer<Reducer, Action>>(
    reducer,
    {
      chats: [],
      currentChat: null,
      messages: [],
    }
  );
  const [{ data: response, streaming: streamingResponse }, getResponse] =
    useFetch("/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      stream: "string",
      onStreamComplete: (content) => {
        addMessage("assistant", content);
      },
    });

  useEffect(() => {
    api.chat
      .findMany({
        first: 50,
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        sort: {
          createdAt: "Descending",
        },
      })
      .then((chats) => {
        dispatch({ type: "setChats", payload: chats as any as ChatSubset[] });
      })
      .catch((error) => {
        console.log("unable to load chats: ", error);
      });
  }, []);

  const selectChat: ChatContextType["selectChat"] = useCallback(
    async (chat) => {
      dispatch({ type: "setCurrentChat", payload: chat });

      const messages = await api.message.findMany({
        filter: {
          chatId: { equals: chat.id },
        },
        last: 100,
        sort: { order: "Ascending" },
        select: {
          id: true,
          role: true,
          order: true,
          content: true,
        },
      });

      const newMessages = messages.map((message) => ({
        id: message.id,
        order: message.order,
        role: message.role,
        content: message.content,
      }));

      dispatch({ type: "setMessages", payload: newMessages });
    },
    [dispatch]
  );

  const startChat = useCallback(async () => {
    const newChat = await api.chat.create({});

    dispatch({ type: "setCurrentChat", payload: newChat });
    dispatch({ type: "addChat", payload: newChat });

    return newChat;
  }, [dispatch]);

  const nameChat: ChatContextType["nameChat"] = useCallback(
    (chat, message: MessageSubset) => {
      api.chat
        .name(chat.id, {
          firstMessage: message.content,
        })
        .then((chat) => {
          dispatch({ type: "updateChat", payload: chat });
        });
    },
    [dispatch]
  );

  const addMessage: ChatContextType["addMessage"] = useCallback(
    (role, content) => {
      const message = {
        id: nanoid(),
        order: state.messages.length + 1,
        role,
        content,
      };

      dispatch({ type: "addMessage", payload: message });

      return message;
    },
    [state, dispatch]
  );

  const respondToMessage: ChatContextType["respondToMessage"] = useCallback(
    async (chat, message) => {
      const isMessageInState = state.messages.some((m) => m.id === message.id);

      const messages = isMessageInState
        ? state.messages
        : [...state.messages, message];

      await Promise.allSettled([
        api.message.create({
          order: message.order,
          role: message.role,
          content: message.content,
          chat: { _link: chat.id },
        }),
        getResponse({
          body: JSON.stringify({
            chatId: chat.id,
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        }),
      ]);
    },
    [state, dispatch]
  );

  const clearChat = useCallback(() => {
    dispatch({ type: "setCurrentChat", payload: null });
    dispatch({ type: "setMessages", payload: [] });
  }, [dispatch]);

  const deleteChat: ChatContextType["deleteChat"] = useCallback(
    async (chat) => {
      dispatch({ type: "deleteChat", payload: chat });
      dispatch({ type: "setMessages", payload: [] });

      if (state.currentChat?.id === chat.id) {
        dispatch({ type: "setCurrentChat", payload: null });
      }

      try {
        await api.chat.delete(chat.id);
      } catch {
        dispatch({ type: "addChat", payload: chat });
      }
    },
    [state, dispatch]
  );

  return (
    <ChatContext.Provider
      value={{
        ...state,
        selectChat,
        startChat,
        nameChat,
        clearChat,
        respondToMessage,
        deleteChat,
        addMessage,
        response,
        streamingResponse,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
