import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import Header from "../../components/user/Header";
import {
  ChatConversation,
  ChatMessage,
  createChatClient,
  fetchConversationMessages,
  fetchMyConversations,
  markConversationAsRead,
  publishChatMessage,
  sendChatImage,
  updateChatMessage,
  getMessageHistory,
} from "../../services/chatService";
import "../../styles/user/Messages.css";
import { useAuth } from "../../context/AuthContext";
import {
  Navigation,
  ImagePlus,
  Smile,
  Search,
  Edit,
  Reply,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggedIn, isAuthLoading } = useAuth();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageDraft, setEditingMessageDraft] = useState("");
  const [expandedHistory, setExpandedHistory] = useState<
    Record<number, { oldContent: string; editedAt: string }[]>
  >({});
  const [draft, setDraft] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMessageQuery, setSearchMessageQuery] = useState("");

  const websocketClientRef = useRef<Client | null>(null);
  const selectedConversationIdRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyMessage, setReplyMessage] = useState<ChatMessage | null>(null);

  const selectedConversation = useMemo(
    () =>
      conversations.find((c) => c.conversationId === selectedConversationId) ??
      null,
    [conversations, selectedConversationId],
  );

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const lowerQuery = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.partnerName?.toLowerCase().includes(lowerQuery) ||
        c.lastMessage?.toLowerCase().includes(lowerQuery) ||
        c.listingTitle?.toLowerCase().includes(lowerQuery),
    );
  }, [conversations, searchQuery]);

  const filteredMessages = useMemo(() => {
    if (!searchMessageQuery.trim()) return messages;
    const lowerQuery = searchMessageQuery.toLowerCase();
    return messages.filter((m) => m.content.toLowerCase().includes(lowerQuery));
  }, [messages, searchMessageQuery]);

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const data = await fetchMyConversations();
      setConversations(data);

      const queryConversationId = Number(searchParams.get("conversationId"));
      const isValidQueryConversation =
        Number.isFinite(queryConversationId) && queryConversationId > 0;

      if (
        isValidQueryConversation &&
        data.some((c) => c.conversationId === queryConversationId)
      ) {
        setSelectedConversationId(queryConversationId);
        return;
      }

      if (!selectedConversationId && data.length > 0) {
        setSelectedConversationId(data[0].conversationId);
      }
    } catch (error) {
      console.error("Không tải được danh sách hội thoại", error);
      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    loadConversations();
  }, [isLoggedIn, isAuthLoading, searchParams]);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    if (messages.length === 0) return;

    const timer = setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    websocketClientRef.current = createChatClient((incomingMessage) => {
      setConversations((prev) => {
        const next = [...prev];
        const index = next.findIndex(
          (c) => c.conversationId === incomingMessage.conversationId,
        );

        if (index >= 0) {
          const current = next[index];
          next[index] = {
            ...current,
            lastMessage: incomingMessage.content,
            updatedAt: incomingMessage.createdAt,
            unreadCount: incomingMessage.isMine
              ? current.unreadCount
              : current.conversationId === selectedConversationIdRef.current
                ? 0
                : current.unreadCount + 1,
          };

          const moved = next.splice(index, 1)[0];
          next.unshift(moved);
        }

        return next;
      });

      if (
        incomingMessage.conversationId === selectedConversationIdRef.current
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === incomingMessage.id);
          if (exists) {
            return prev;
          }
          return [...prev, incomingMessage];
        });

        // Handle edited messages (assuming WebSocket also sends MESSAGE_EDITED)
        if (
          (incomingMessage as any).type === "MESSAGE_EDITED" &&
          incomingMessage.conversationId === selectedConversationIdRef.current
        ) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === incomingMessage.id
                ? {
                    ...msg,
                    content: incomingMessage.content,
                    isEdited: true,
                    lastEditedAt: (incomingMessage as any).lastEditedAt,
                  }
                : msg,
            ),
          );
        }

        if (!incomingMessage.isMine) {
          markConversationAsRead(incomingMessage.conversationId)
            .then(() => {
              // Báo cho Header biết để refetch notifications
              window.dispatchEvent(new Event("conversationRead"));
            })
            .catch((error) => {
              console.error("Không thể đánh dấu đã đọc", error);
            });
        }
      }
    });

    return () => {
      websocketClientRef.current?.deactivate();
      websocketClientRef.current = null;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    setSearchMessageQuery("");
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setEditingMessageId(null); // Thoát chế độ chỉnh sửa khi chuyển conversation
      setEditingMessageDraft("");
      try {
        setIsLoadingMessages(true);
        const data = await fetchConversationMessages(selectedConversationId);
        setMessages(data);

        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        });

        await markConversationAsRead(selectedConversationId);
        window.dispatchEvent(new Event("conversationRead"));
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.conversationId === selectedConversationId
              ? { ...conversation, unreadCount: 0 }
              : conversation,
          ),
        );
      } catch (error) {
        console.error("Không tải được tin nhắn", error);
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedConversationId]);

  const resolveAvatar = (avatar: string | null | undefined, name: string) => {
    if (avatar && avatar.trim() !== "") {
      if (avatar.startsWith("http") || avatar.startsWith("/images/")) {
        return avatar;
      }
      return `http://localhost:8080${avatar.startsWith("/") ? "" : "/"}${avatar}`;
    }

    return "/images/avatar_default.jpg";
  };

  const resolveListingImage = (imageUrl: string | null | undefined) => {
    if (!imageUrl) {
      return "/images/detail.png";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `http://localhost:8080${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  const formatPrice = (price: number | null) => {
    if (price === null || Number.isNaN(price)) {
      return "";
    }

    return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
  };

  const formatTime = (value: string | null) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();

    if (!selectedConversationId) {
      return;
    }

    if (!draft.trim()) {
      return;
    }

    const client = websocketClientRef.current;
    if (!client || !client.connected) {
      window.alert(
        "Kết nối realtime chưa sẵn sàng. Vui lòng thử lại sau 1-2 giây.",
      );
      return;
    }

    publishChatMessage(
      client,
      selectedConversationId,
      draft.trim(),
      replyMessage?.id,
    );
    setDraft("");

    // Clear reply sau khi gửi
    setReplyMessage(null);
  };

  const startEditing = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setEditingMessageDraft(message.content);
    setShowEmojiPicker(false); // Đóng emoji picker khi bắt đầu chỉnh sửa
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingMessageDraft("");
  };

  const saveEditedMessage = async () => {
    if (!editingMessageId || !editingMessageDraft.trim()) {
      return;
    }

    const client = websocketClientRef.current;
    if (!client || !client.connected) {
      window.alert(
        "Kết nối realtime chưa sẵn sàng. Vui lòng thử lại sau 1-2 giây.",
      );
      return;
    }

    try {
      // Gọi API cập nhật tin nhắn
      const updatedMsg = await updateChatMessage(
        editingMessageId,
        editingMessageDraft.trim(),
      );
      setEditingMessageId(null);
      setEditingMessageDraft("");
    } catch (error) {
      console.error(error);
      window.alert("Không thể chỉnh sửa tin nhắn");
    }
  };

  const toggleMessageHistory = async (messageId: number) => {
    if (expandedHistory[messageId]) {
      setExpandedHistory((prev) => {
        const next = { ...prev };
        delete next[messageId];
        return next;
      });
      return;
    }
    try {
      const history = await getMessageHistory(messageId);
      setExpandedHistory((prev) => ({ ...prev, [messageId]: history }));
    } catch (error) {
      console.error("Không tải được lịch sử tin nhắn", error);
      window.alert("Không tải được lịch sử tin nhắn");
    }
  };

  const handleSendLocation = () => {
    if (!selectedConversationId) return;

    // Kiểm tra xem trình duyệt có hỗ trợ lấy vị trí không
    if (!navigator.geolocation) {
      window.alert("Trình duyệt của bạn không hỗ trợ định vị!");
      return;
    }

    const client = websocketClientRef.current;
    if (!client || !client.connected) {
      window.alert("Kết nối realtime chưa sẵn sàng. Vui lòng thử lại.");
      return;
    }

    // Xin quyền và lấy tọa độ hiện tại
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // [Vị trí] để thông báo hiển thị
        const locationContent = `[Vị trí] ${lat},${lng}`;
        publishChatMessage(client, selectedConversationId, locationContent);
      },
      (error) => {
        console.error("Lỗi lấy vị trí:", error);
        window.alert(
          "Không thể lấy vị trí. Vui lòng cấp quyền định vị cho trình duyệt.",
        );
      },
    );
  };

  // Xử lý chức năng gửi ảnh
  const handleSendImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !selectedConversationId) {
      return;
    }

    try {
      await sendChatImage(selectedConversationId, file);
    } catch (error) {
      console.error(error);
      window.alert("Không thể gửi ảnh");
    }
  };

  // Xử lý gửi emoji
  const handleEmojiClick = (emojiObject: any) => {
    setDraft((prev) => prev + emojiObject.emoji);
  };

  // Nếu là text thì in text,
  // Nếu là ảnh thì vẽ ảnh,
  // Nếu là vị trí thì vẽ bản đồ
  const renderMessageContent = (content: string) => {
    // Hình ảnh
    if (content.startsWith("[IMAGE] ")) {
      const imageUrl = content.replace("[IMAGE] ", "");

      return (
        <img
          src={imageUrl}
          alt="chat"
          style={{
            maxWidth: "240px",
            borderRadius: "12px",
          }}
        />
      );
    }

    // Vị trí
    if (content.startsWith("[Vị trí] ")) {
      const coords = content.replace("[Vị trí] ", "");
      const [latStr, lngStr] = coords.split(",");
      const latNum = parseFloat(latStr);
      const lngNum = parseFloat(lngStr);

      // Tính toán khung hình (bounding box) cho bản đồ OpenStreetMap
      const offset = 0.005;
      const bbox = `${lngNum - offset},${latNum - offset},${lngNum + offset},${latNum + offset}`;
      const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latNum},${lngNum}`;
      const osmUrl = `https://www.openstreetmap.org/?mlat=${latNum}&mlon=${lngNum}#map=16/${latNum}/${lngNum}`;

      return (
        <div
          className="location-message"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minWidth: "200px",
          }}
        >
          <div
            style={{
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Navigation size={16} /> Vị trí được chia sẻ
          </div>
          {/* Dùng iframe của OpenStreetMap*/}
          <iframe
            width="100%"
            height="150"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={iframeSrc}
            style={{ borderRadius: "8px", border: "1px solid #ddd" }}
          ></iframe>
          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "underline",
              fontSize: "12px",
              textAlign: "right",
            }}
          >
            Xem bản đồ lớn
          </a>
        </div>
      );
    }

    // Nếu đang tìm kiếm tin nhắn, tiến hành highlight từ khóa
    if (searchMessageQuery.trim()) {
      // Hàm escape các ký tự đặc biệt trong regex để tránh lỗi (vd: user gõ dấu "?", "*", "[")
      const escapeRegExp = (str: string) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const parts = content.split(
        new RegExp(`(${escapeRegExp(searchMessageQuery)})`, "gi"),
      );
      return (
        <span>
          {parts.map((part, i) =>
            part.toLowerCase() === searchMessageQuery.toLowerCase() ? (
              <mark
                key={i}
                style={{
                  backgroundColor: "#fef08a",
                  color: "inherit",
                  padding: "0 2px",
                  borderRadius: "3px",
                }}
              >
                {part}
              </mark>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </span>
      );
    }

    return content;
  };
  // xong chức năng gủi vị trí

  return (
    <>
      <Header />

      <div className="chat-page">
        <div className="chat-container">
          <aside className="chat-sidebar">
            <div className="chat-sidebar-title">Tin nhắn</div>

            {/* Thanh tìm kiếm hội thoại */}
            <div
              className="chat-sidebar-search"
              style={{ padding: "0 16px 12px 16px", marginTop: "12px" }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Search
                  size={18}
                  style={{
                    position: "absolute",
                    left: "12px",
                    color: "#6B7280",
                  }}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 36px",
                    borderRadius: "20px",
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#F9FAFB",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            {isLoadingConversations && (
              <div className="chat-empty">Đang tải hội thoại...</div>
            )}

            {!isLoadingConversations &&
              filteredConversations.length === 0 &&
              searchQuery && (
                <div className="chat-empty">Không tìm thấy kết quả.</div>
              )}

            {!isLoadingConversations &&
              conversations.length === 0 &&
              !searchQuery && (
                <div className="chat-empty">Bạn chưa có hội thoại nào.</div>
              )}

            {!isLoadingConversations &&
              filteredConversations.map((conversation) => {
                const isActive =
                  conversation.conversationId === selectedConversationId;

                return (
                  <button
                    key={conversation.conversationId}
                    type="button"
                    className={`chat-conversation-item ${isActive ? "active" : ""}`}
                    onClick={() =>
                      setSelectedConversationId(conversation.conversationId)
                    }
                  >
                    <img
                      src={resolveAvatar(
                        conversation.partnerAvatar,
                        conversation.partnerName,
                      )}
                      alt={conversation.partnerName}
                      className="chat-conversation-avatar"
                    />

                    <div className="chat-conversation-content">
                      <div className="chat-conversation-top">
                        <span className="chat-conversation-name">
                          {conversation.partnerName}
                        </span>
                        <span className="chat-conversation-time">
                          {formatTime(conversation.updatedAt)}
                        </span>
                      </div>

                      <div
                        className="chat-conversation-last"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {conversation.lastMessage?.includes("[Vị trí]") ? (
                          <>
                            <Navigation size={12} />
                            <span>Đã chia sẻ một vị trí</span>
                          </>
                        ) : conversation.lastMessage?.includes("[IMAGE]") ? (
                          <>
                            <ImagePlus size={12} />
                            <span>Đã gửi một ảnh</span>
                          </>
                        ) : (
                          conversation.lastMessage || "Chưa có tin nhắn"
                        )}
                      </div>
                    </div>

                    {conversation.unreadCount > 0 && (
                      <span className="chat-unread-badge">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
          </aside>

          <section className="chat-main">
            {!selectedConversation && (
              <div className="chat-main-empty">
                Chọn một hội thoại để bắt đầu nhắn tin.
              </div>
            )}

            {selectedConversation && (
              <>
                <div className="chat-main-header">
                  <div className="chat-main-user">
                    <img
                      src={resolveAvatar(
                        selectedConversation.partnerAvatar,
                        selectedConversation.partnerName,
                      )}
                      alt={selectedConversation.partnerName}
                      className="chat-main-avatar"
                    />
                    <div>
                      <h3>{selectedConversation.partnerName}</h3>
                      <p>
                        {selectedConversation.partnerUniversity || "SV Market"}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    {/* Thanh tìm kiếm tin nhắn trong hội thoại */}
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Search
                        size={18}
                        style={{
                          position: "absolute",
                          left: "10px",
                          color: "#6B7280",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Tìm trong đoạn chat..."
                        value={searchMessageQuery}
                        onChange={(e) => setSearchMessageQuery(e.target.value)}
                        style={{
                          padding: "6px 12px 6px 34px",
                          borderRadius: "20px",
                          border: "1px solid #E5E7EB",
                          outline: "none",
                          fontSize: "14px",
                          width: "200px",
                        }}
                      />
                    </div>

                    {selectedConversation.listingId && (
                      <button
                        type="button"
                        className="chat-open-product-btn"
                        onClick={() =>
                          navigate(`/product/${selectedConversation.listingId}`)
                        }
                      >
                        Xem sản phẩm
                      </button>
                    )}
                  </div>
                </div>

                <div className="chat-listing-card">
                  <img
                    src={resolveListingImage(
                      selectedConversation.listingThumbnail,
                    )}
                    alt={selectedConversation.listingTitle || "Sản phẩm"}
                    className="chat-listing-image"
                    onError={(event) => {
                      event.currentTarget.src = "/images/detail.png";
                    }}
                  />
                  <div>
                    <div className="chat-listing-title">
                      {selectedConversation.listingTitle || "Sản phẩm"}
                    </div>
                    <div className="chat-listing-price">
                      {formatPrice(selectedConversation.listingPrice)}
                    </div>
                  </div>
                </div>

                <div className="chat-messages-area">
                  {isLoadingMessages && (
                    <div className="chat-empty">Đang tải tin nhắn...</div>
                  )}

                  {!isLoadingMessages &&
                    filteredMessages.length === 0 &&
                    searchMessageQuery && (
                      <div className="chat-empty">
                        Không tìm thấy tin nhắn nào khớp với "
                        {searchMessageQuery}".
                      </div>
                    )}

                  {!isLoadingMessages &&
                    messages.length === 0 &&
                    !searchMessageQuery && (
                      <div className="chat-empty" style={{ textAlign: "center", width: "100%", padding: "20px 0" }}>
                        Bắt đầu cuộc trò chuyện ngay nhé.
                      </div>
                    )}

                  {!isLoadingMessages &&
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`chat-bubble-row ${message.isMine ? "mine" : "theirs"}`}
                      >
                        {/* Nút trả lời tin nhắn */}
                        {/* Tên hiện ngoài bubble */}
                        <div className="chat-bubble-wrapper">
                          <div className="chat-bubble-name">
                            {message.isMine
                              ? "Bạn"
                              : selectedConversation.partnerName}
                          </div>

                          {editingMessageId === message.id ? (
                            <div
                              className={`chat-bubble ${message.isMine ? "mine" : "theirs"}`}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                              }}
                            >
                              <input
                                type="text"
                                value={editingMessageDraft}
                                onChange={(e) =>
                                  setEditingMessageDraft(e.target.value)
                                }
                                autoFocus
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  border: "1px solid #ccc",
                                  outline: "none",
                                }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <button
                                  onClick={cancelEditing}
                                  style={{
                                    fontSize: "12px",
                                    padding: "2px 8px",
                                    cursor: "pointer",
                                    backgroundColor: "#c0392b",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                  }}
                                >
                                  Hủy
                                </button>
                                <button
                                  onClick={saveEditedMessage}
                                  style={{
                                    fontSize: "12px",
                                    padding: "2px 8px",
                                    cursor: "pointer",
                                    backgroundColor: "#1B7A4A",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                  }}
                                >
                                  Lưu
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-end",
                                gap: "4px",
                                flexDirection: message.isMine
                                  ? "row-reverse"
                                  : "row",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                  alignItems: message.isMine
                                    ? "flex-end"
                                    : "flex-start",
                                }}
                              >
                                {/* Bong bóng lịch sử tin nhắn */}
                                {expandedHistory[message.id] &&
                                  expandedHistory[message.id]
                                    .slice()
                                    .reverse()
                                    .map((hist, index, revArr) => (
                                      <div
                                        key={index}
                                        className={`chat-bubble ${message.isMine ? "mine" : "theirs"}`}
                                        style={{
                                          opacity: 0.6,
                                          fontSize: "13px",
                                        }}
                                      >
                                        <div className="chat-bubble-text">
                                          {renderMessageContent(
                                            hist.oldContent,
                                          )}
                                        </div>
                                        <div
                                          className="chat-bubble-time"
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                          }}
                                        >
                                          {formatTime(
                                            index === 0
                                              ? message.createdAt
                                              : revArr[index - 1].editedAt,
                                          )}
                                        </div>
                                      </div>
                                    ))}

                                {/* Bong bóng tin nhắn hiện tại */}

                                <div
                                  className={`chat-bubble ${message.isMine ? "mine" : "theirs"}`}
                                >
                                  {message.replyMessageId && (
                                    <div className="chat-replied-message">
                                      <div className="chat-replied-name">
                                        {message.replySenderName}
                                      </div>

                                      <div className="chat-replied-content">
                                        {message.replyMessageContent}
                                      </div>
                                    </div>
                                  )}
                                  <div className="chat-bubble-text">
                                    {renderMessageContent(message.content)}
                                  </div>
                                  <div
                                    className="chat-bubble-time"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    {formatTime(
                                      message.isEdited && message.lastEditedAt
                                        ? message.lastEditedAt
                                        : message.createdAt,
                                    )}
                                    {message.isEdited && (
                                      <span
                                        title={
                                          expandedHistory[message.id]
                                            ? "Ẩn lịch sử"
                                            : "Xem lịch sử chỉnh sửa"
                                        }
                                        className="chat-edited-label"
                                        style={{
                                          cursor: "pointer",
                                          fontSize: "11px",
                                          textDecoration: "underline",
                                        }}
                                        onClick={() =>
                                          toggleMessageHistory(message.id)
                                        }
                                      >
                                        {expandedHistory[message.id]
                                          ? "(Ẩn chỉnh sửa)"
                                          : "(Đã chỉnh sửa)"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {!message.isMine && (
                                <button
                                  className="chat-reply-btn"
                                  onClick={() => setReplyMessage(message)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#6b7280",
                                  }}
                                  title="Trả lời"
                                >
                                  <Reply size={16} />
                                </button>
                              )}

                              {message.isMine &&
                                !(
                                  message.content.startsWith("[IMAGE]") ||
                                  message.content.startsWith("[Vị trí]")
                                ) && (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "4px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <button
                                      className="chat-reply-btn"
                                      onClick={() => setReplyMessage(message)}
                                      style={{
                                        width: "28px",
                                        height: "28px",
                                      }}
                                      title="Trả lời"
                                    >
                                      <Reply size={14} />
                                    </button>
                                    <button
                                      className="edit-message-btn"
                                      onClick={() => startEditing(message)}
                                      style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        opacity: 0.5,
                                        padding: "4px",
                                        marginBottom: "8px",
                                      }}
                                      title="Chỉnh sửa tin nhắn"
                                    >
                                      <Edit size={14} />
                                    </button>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  <div ref={bottomRef}></div>
                </div>

                {replyMessage && (
                  <div className="chat-reply-preview">
                    <div className="chat-reply-preview-left">
                      <div className="chat-reply-line"></div>

                      <div>
                        <div className="chat-reply-name">
                          Trả lời {replyMessage.senderName}
                        </div>

                        <div className="chat-reply-content">
                          {replyMessage.content}
                        </div>
                      </div>
                    </div>

                    <button
                      className="chat-close-reply"
                      onClick={() => setReplyMessage(null)}
                    >
                      ✕
                    </button>
                  </div>
                )}
                <form className="chat-input-wrap" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                  {/* Nút gửi vị trí */}
                  <button
                    type="button"
                    onClick={handleSendLocation}
                    title="Chia sẻ vị trí hiện tại"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0 10px",
                      color: "#000",
                      transition: "color 0.2s",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#1B7A4A")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
                  >
                    <Navigation size={22} />
                  </button>

                  {/* Nút gửi ảnh */}
                  <label className="chat-input-image">
                    <ImagePlus size={22} />

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleSendImage}
                    />
                  </label>

                  {/* Nút gửi emoji */}
                  <div className="emoji-container">
                    <button
                      type="button"
                      className="chat-input-icon"
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                    >
                      <Smile size={22} />
                    </button>

                    {showEmojiPicker && (
                      <div className="emoji-picker-wrapper">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                  <button type="submit">Gửi</button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
