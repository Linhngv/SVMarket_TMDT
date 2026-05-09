package com.example.svmarket.controller;

import com.example.svmarket.dto.ChatConversationResponse;
import com.example.svmarket.dto.ChatMessageResponse;
import com.example.svmarket.dto.ChatStartConversationRequest;
import com.example.svmarket.dto.MessageHistoryResponse;
import com.example.svmarket.service.ChatService;
import com.example.svmarket.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private JwtUtil jwtUtil;

    // Tao hoi thoai tu trang chi tiet san pham.
    @PostMapping("/conversations/start")
    public ChatConversationResponse startConversation(
            @RequestHeader("Authorization") String bearerToken,
            @Valid @RequestBody ChatStartConversationRequest request) {
        String email = extractEmail(bearerToken);
        return chatService.startConversation(email, request.getListingId());
    }

    // Lay danh sach hoi thoai cua nguoi dung.
    @GetMapping("/conversations")
    public List<ChatConversationResponse> getMyConversations(
            @RequestHeader("Authorization") String bearerToken) {
        String email = extractEmail(bearerToken);
        return chatService.getMyConversations(email);
    }

    // Lay toan bo tin nhan theo hoi thoai.
    @GetMapping("/conversations/{conversationId}/messages")
    public List<ChatMessageResponse> getConversationMessages(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable Integer conversationId) {
        String email = extractEmail(bearerToken);
        return chatService.getConversationMessages(email, conversationId);
    }

    // Danh dau tin nhan la da doc.
    @PostMapping("/conversations/{conversationId}/read")
    public void markConversationRead(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable Integer conversationId) {
        String email = extractEmail(bearerToken);
        chatService.markConversationAsRead(email, conversationId);
    }

    // Chỉnh sửa tin nhắn
    @PutMapping("/messages/{messageId}")
    public ChatMessageResponse editMessage(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable Integer messageId,
            @RequestBody java.util.Map<String, String> payload) {
        String email = extractEmail(bearerToken);
        return chatService.editMessage(email, messageId, payload.get("content"));
    }

    // Xem lịch sử chỉnh sửa tin nhắn
    @GetMapping("/messages/{messageId}/history")
    public List<MessageHistoryResponse> getMessageHistory(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable Integer messageId) {
        String email = extractEmail(bearerToken);
        return chatService.getMessageHistory(email, messageId);
    }

    private String extractEmail(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        return jwtUtil.extractEmail(bearerToken.replace("Bearer ", ""));
    }

    // Gửi ảnh
    @PostMapping("/conversations/{conversationId}/image")
    public ChatMessageResponse sendImage(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable Integer conversationId,
            @RequestParam("file") MultipartFile file
    ) {

        String email = extractEmail(bearerToken);

        return chatService.sendImageMessage(
                email,
                conversationId,
                file
        );
    }
}
