package com.example.svmarket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.svmarket.dto.OrderRequest;
import com.example.svmarket.entity.Listing;
import com.example.svmarket.entity.Order;
import com.example.svmarket.entity.OrderDetail;
import com.example.svmarket.entity.OrderStatus;
import com.example.svmarket.entity.Notification;
import com.example.svmarket.entity.NotificationType;
import com.example.svmarket.entity.User;
import com.example.svmarket.repository.ListingRepository;
import com.example.svmarket.repository.OrderDetailRepository;
import com.example.svmarket.repository.OrderRepository;
import com.example.svmarket.repository.NotificationRepository;
import com.example.svmarket.repository.UserRepository;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public void createOrder(String buyerEmail, OrderRequest request) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người mua"));

        Listing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài đăng"));

        // Tạo đơn hàng lưu vào bảng orders
        Order order = Order.builder()
                .buyer(buyer)
                .seller(listing.getSeller())
                .totalAmount(listing.getPrice())
                .status(OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);

        // Tạo chi tiết đơn hàng lưu vào bảng order_details
        OrderDetail orderDetail = OrderDetail.builder()
                .order(savedOrder)
                .listing(listing)
                .quantity(1)
                .price(listing.getPrice())
                .build();

        orderDetailRepository.save(orderDetail);

        // Tạo thông báo gửi đến người bán
        String content = buyer.getFullName() + " muốn mua " + listing.getTitle();
        Notification notification = Notification.builder()
                .user(listing.getSeller())
                .content(content)
                .type(NotificationType.ORDER)
                .referenceId(savedOrder.getId())
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
}