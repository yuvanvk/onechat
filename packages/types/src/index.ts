export type WebSocketCreateStreamMessage = {
  type: "chat.stream.create";
  eventId: string;
  role: Role.User;
  model: string;
  content: string;
  conversationId: string;
};

export type WebSocketCancelMessage = {
  type: "chat.stream.cancel";
  eventId: string;
  conversationId: string;
};

export type WebSocketRegenerateStreamMessage = {
  type: "chat.stream.regenerate";
  eventId: string;
  messageId: string;
  conversationId: string;
  model: string;
};

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
};

export type WebSocketClientMessage =
  | WebSocketCreateStreamMessage
  | WebSocketCancelMessage
  | WebSocketRegenerateStreamMessage;


export type WebSocketServerMessage =
  | WebSocketStreamAIResponse
  | WebSocketStreamAIDone;


export type Message = {
  id?: string
  role: Role;
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
}

export enum Role {
  Assistant = "assistant",
  User = "user",
}
