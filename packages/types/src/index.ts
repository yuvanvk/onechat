export type WebSocketCreateStreamMessage = {
  type: "chat.stream.create";
  role: Role.User;
  model: string;
  content: string;
  objects?: { name: string; type: string; size: number }[];
  conversationId: string;
};

export type WebSocketGenerateImage = {
  type: "chat.generate.image",
  role: Role.User
  content: string;
  model: string;
  conversationId: string;
  objects?: { name: string; type: string; size: number }[];
}

export type WebSocketCancelMessage = {
  type: "chat.stream.cancel";
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
  role: Role.Assistant;
  content: string;
  conversationId: string;
};

export type WebSocketStreamAIDone = {
  type: "chat.stream.done";
  conversationId: string;
  userMessageId?: string;
  aiMessageId?: string;
};

export type WebSocketTitleGeneratedMessage = {
  type: "chat.title.generated";
  title: string;
  conversationId: string; 
}

export type WebSocketImageGenerated = {
  type: "chat.generated.image";
  id: string,
  role: Role.Assistant,
  messageType: "image";
  conversationId: string;
  imageKey: string;
  userMessageId: string;
}

export type WebSocketErrorMessage = {
  type: "chat.stream.error",
  conversationId: string,
  message: string
}

export type WebSocketClientMessage =
  | WebSocketCreateStreamMessage
  | WebSocketCancelMessage
  | WebSocketRegenerateStreamMessage
  | WebSocketGenerateImage;


export type WebSocketServerMessage =
  | WebSocketStreamAIResponse
  | WebSocketStreamAIDone
  | WebSocketTitleGeneratedMessage
  | WebSocketStreamRegenerteResponse
  | WebSocketRegenerateResponseDone
  | WebSocketErrorMessage
  |WebSocketImageGenerated;


export type Message = {
  id?: string
  role: Role;
  messageType: "text" | "image";
  content?: string;
  model?: string;
  pdfs?: { name: string; type: string; size: number }[];
  images?: { name: string; type: string; size: number }[];
  imageKey?: string;
};

export type Conversation = {
  id: string;
  title: string;
}

export enum Role {
  Assistant = "assistant",
  User = "user",
}
