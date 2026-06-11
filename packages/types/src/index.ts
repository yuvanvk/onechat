export type WebSocketCreateStreamMessage = {
  type: "chat.stream.create";
  eventId: string;
  role: Role.User;
  model: string;
  content: string;
  objects?: { name: string; type: string; size: number }[];
  conversationId: string;
};

export type WebSocketCancelMessage = {
  type: "chat.stream.cancel";
  eventId: string;
  conversationId: string;
};

export type WebSocketRegenerateStreamMessage = {
  type: "chat.stream.regenerate";
  messageId: string;
  content: string;
  conversationId: string;
  model: string;
};

export type WebSocketStreamRegenerteResponse = {
  type: "chat.regenerate.response";
  messageId: string;
  role: Role.Assistant;
  content: string;
  conversationId: string;
}

export type WebSocketRegenerateResponseDone = {
  type: "chat.regenerate.done";
  messageId: string;
  conversationId: string;
}

export type WebSocketStreamAIResponse = {
  type: "chat.stream.response";
  eventId: string;
  role: Role.Assistant;
  content: string;
  conversationId: string;
};

export type WebSocketStreamAIDone = {
  type: "chat.stream.done";
  eventId: string;
  conversationId: string;
  userMessageId?: string;
  aiMessageId?: string;
};

export type WebSocketTitleGeneratedMessage = {
  type: "chat.title.generated";
  eventId: string;
  title: string;
  conversationId: string; 
}

export type WebSocketErrorMessage = {
  type: "chat.stream.error",
  eventId: string,
  conversationId: string,
  message: string
}

export type WebSocketClientMessage =
  | WebSocketCreateStreamMessage
  | WebSocketCancelMessage
  | WebSocketRegenerateStreamMessage;


export type WebSocketServerMessage =
  | WebSocketStreamAIResponse
  | WebSocketStreamAIDone
  | WebSocketTitleGeneratedMessage
  | WebSocketStreamRegenerteResponse
  | WebSocketRegenerateResponseDone
  | WebSocketErrorMessage;


export type Message = {
  id?: string
  role: Role;
  content: string;
  model?: string;
  pdfs?: { name: string; type: string; size: number }[];
  images?: { name: string; type: string; size: number }[];
};

export type Conversation = {
  id: string;
  title: string;
}

export enum Role {
  Assistant = "assistant",
  User = "user",
}
