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
} from "../../services/chatService";
import "../../styles/user/Messages.css";
import { useAuth } from "../../context/AuthContext";
import { Navigation } from "lucide-react";

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggedIn, isAuthLoading } = useAuth();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [draft, setDraft] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const websocketClientRef = useRef<Client | null>(null);
  const selectedConversationIdRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const selectedConversation = useMemo(
    () =>
      conversations.find((c) => c.conversationId === selectedConversationId) ??
      null,
    [conversations, selectedConversationId],
  );

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
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
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

    publishChatMessage(client, selectedConversationId, draft.trim());
    setDraft("");
  };

 
  // chức năng gủi vi trí hiện tại của người dùng
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
        window.alert("Không thể lấy vị trí. Vui lòng cấp quyền định vị cho trình duyệt.");
      }
    );
  };

  // Hàm phân tích nội dung: Nếu là text thì in text, nếu là vị trí thì vẽ bản đồ
  const renderMessageContent = (content: string) => {
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
        <div className="location-message" style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "200px" }}>
          <div style={{ fontWeight: "600", fontSize: "14px", display: 'flex', alignItems: 'center', gap: '6px' }}><Navigation size={16} /> Vị trí được chia sẻ</div>
          {/* Dùng iframe của OpenStreetMap*/}
          <iframe width="100%" height="150" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src={iframeSrc} style={{ borderRadius: "8px", border: "1px solid #ddd" }}></iframe>
          <a href={osmUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", fontSize: "12px", textAlign: "right" }}>Xem bản đồ lớn</a>
        </div>
      );
    }
    return content;
  };
  //xong chức năng gủi vị trí
  

  return (
    <>
      <Header />

      <div className="chat-page">
        <div className="chat-container">
          <aside className="chat-sidebar">
            <div className="chat-sidebar-title">Tin nhắn</div>

            {isLoadingConversations && (
              <div className="chat-empty">Đang tải hội thoại...</div>
            )}

            {!isLoadingConversations && conversations.length === 0 && (
              <div className="chat-empty">Bạn chưa có hội thoại nào.</div>
            )}

            {!isLoadingConversations &&
              conversations.map((conversation) => {
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

                      <div className="chat-conversation-product">
                        {conversation.listingTitle || "Bài đăng"}
                      </div>
                      <div className="chat-conversation-last" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {conversation.lastMessage?.includes("[Vị trí]")
                          ? <><Navigation size={12} /> <span>Đã chia sẻ một vị trí</span></>
                          : conversation.lastMessage || "Chưa có tin nhắn"}
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

                  {!isLoadingMessages && messages.length === 0 && (
                    <div className="chat-empty">
                      Bắt đầu cuộc trò chuyện ngay nhé.
                    </div>
                  )}

                  {!isLoadingMessages &&
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`chat-bubble-row ${message.isMine ? "mine" : "theirs"}`}
                      >
                        {/* Tên hiện ngoài bubble */}
                        <div className="chat-bubble-wrapper">
                          <div className="chat-bubble-name">
                            {message.isMine
                              ? "Bạn"
                              : selectedConversation.partnerName}
                          </div>
                          <div
                            className={`chat-bubble ${message.isMine ? "mine" : "theirs"}`}
                          >
                            <div className="chat-bubble-text">
                              {/* Sử dụng hàm render thay vì in text thẳng để vẽ map */}
                              {renderMessageContent(message.content)}
                            </div>
                            <div className="chat-bubble-time">
                              {formatTime(message.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  <div ref={bottomRef}></div>
                </div>

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
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0 10px", color: "#000", transition: "color 0.2s", display: "flex", alignItems: "center" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#1B7A4A"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#000"}
                  >
                    <Navigation size={22} />
                  </button>
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
