import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const CHAT_API = "http://localhost:8080/api/chat";
const WS_URL = "http://localhost:8080/ws";

export type ChatConversation = {
  conversationId: number;
  listingId: number | null;
  listingTitle: string;
  listingThumbnail: string | null;
  listingPrice: number | null;
  partnerId: number | null;
  partnerName: string;
  partnerAvatar: string | null;
  partnerUniversity: string | null;
  lastMessage: string | null;
  updatedAt: string | null;
  unreadCount: number;
};

export type ChatMessage = {
  id: number;
  conversationId: number;
  senderId: number | null;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  isRead: boolean;
  isMine: boolean;
  createdAt: string | null;
  isEdited?: boolean;
  lastEditedAt?: string | null;
  type?: string;
  replyMessageId?: number | null;
  replyMessageContent?: string | null;
  replySenderName?: string | null;
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Vui lòng đăng nhập để sử dụng chat");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function startConversation(listingId: number) {
  const response = await axios.post<ChatConversation>(
    `${CHAT_API}/conversations/start`,
    { listingId },
    { headers: getAuthHeaders() },
  );

  return response.data;
}

export async function updateChatMessage(messageId: number, content: string) {
  const response = await axios.put(
    `${CHAT_API}/messages/${messageId}`,
    { content },
    { headers: getAuthHeaders() },
  );
  return response.data;
}

export async function getMessageHistory(messageId: number) {
  const response = await axios.get<{ oldContent: string; editedAt: string }[]>(
    `${CHAT_API}/messages/${messageId}/history`,
    { headers: getAuthHeaders() },
  );
  return response.data;
}

export async function fetchMyConversations() {
  const response = await axios.get<ChatConversation[]>(
    `${CHAT_API}/conversations`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function fetchConversationMessages(conversationId: number) {
  const response = await axios.get<ChatMessage[]>(
    `${CHAT_API}/conversations/${conversationId}/messages`,
    { headers: getAuthHeaders() },
  );

  return response.data;
}

export async function markConversationAsRead(conversationId: number) {
  await axios.post(
    `${CHAT_API}/conversations/${conversationId}/read`,
    {},
    { headers: getAuthHeaders() },
  );
}

export function createChatClient(
  onMessage: (message: ChatMessage) => void,
  onNotification?: () => void,
) {
  const token = localStorage.getItem("token");

  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 2500,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

  client.onConnect = () => {
    client.subscribe("/user/queue/messages", (frame) => {
      try {
        const payload = JSON.parse(frame.body) as ChatMessage;
        onMessage(payload);
      } catch (error) {
        console.error("Không parse được payload websocket", error);
      }
    });

    // Nhận notification realtime
    client.subscribe("/user/queue/notifications", () => {
      if (onNotification) onNotification();
    });
  };

  client.onStompError = (frame) => {
    console.error("STOMP error", frame.headers["message"], frame.body);
  };

  client.activate();

  return client;
}

export function publishChatMessage(
  client: Client,
  conversationId: number,
  content: string,
  replyToMessageId?: number | null,
) {
  client.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({ conversationId, content, replyToMessageId }),
  });
}

export async function sendChatImage(conversationId: number, file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    `${CHAT_API}/conversations/${conversationId}/image`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
