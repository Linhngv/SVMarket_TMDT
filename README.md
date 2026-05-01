# SVMarket_TMDT

npm install @stomp/stompjs sockjs-client
npm install -D @types/sockjs-client

## 4. Chức năng chat realtime (WebSocket + lưu DB)

1. Người mua bấm `Nhắn tin` tại trang chi tiết sản phẩm.
2. Frontend gọi API tạo/lấy hội thoại theo `listingId`.
3. Điều hướng sang trang `/messages?conversationId=...`.
4. Trang chat mở kết nối WebSocket STOMP tới endpoint `/ws`.
5. Khi gửi tin nhắn:
   - Client publish lên `/app/chat.send`.
   - Backend lưu trực tiếp vào bảng `messages`.
   - Backend push realtime về `/user/queue/messages` cho cả buyer và seller.
