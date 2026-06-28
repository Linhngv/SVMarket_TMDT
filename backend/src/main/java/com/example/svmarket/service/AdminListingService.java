package com.example.svmarket.service;

import java.time.LocalDateTime;
import java.util.*;
import com.example.svmarket.entity.*;
import com.example.svmarket.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.svmarket.dto.ListingDetailResponse;
import com.example.svmarket.dto.ListingSummaryResponse;

@Service
@Transactional
public class AdminListingService {

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private ListingUpdateRepository listingUpdateRepository;

    @Autowired
    private SellerPackageRepository sellerPackageRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy tất cả bài đăng cho Admin (bất kể trạng thái ACTIVE, PENDING, REJECTED, v.v.)
    public List<ListingSummaryResponse> getAllListings() {
        return listingRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    // Lấy danh sách bài đăng đang chờ duyệt (PENDING)
    public List<ListingDetailResponse> getPendingListings() {
        return listingRepository.findByStatusOrderByCreatedAtDesc(ListingStatus.PENDING)
                .stream()
                .map(this::toDetailResponse)
                .toList();
    }

    // Lấy danh sách bài đăng bị từ chối (REJECTED) để hiển thị ở Danh sách vi phạm
    public List<ListingDetailResponse> getRejectedListings() {
        return listingRepository.findByStatusOrderByCreatedAtDesc(ListingStatus.REJECTED)
                .stream()
                .map(this::toDetailResponse)
                .toList();
    }

    // Lấy chi tiết một bài đăng cho Admin
    public ListingDetailResponse getListingById(Integer id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài đăng"));
        return toDetailResponse(listing);
    }

    // Cập nhật trạng thái thành ACTIVE
    public void approveListing(Integer id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài đăng"));

        if (listing.getStatus() == ListingStatus.ACTIVE) return;

        // Nếu là duyệt một bản cập nhật, áp dụng các thay đổi
        listingUpdateRepository.findFirstByListingIdAndStatusOrderByCreatedAtDesc(id, ListingUpdateStatus.PENDING)
                .ifPresent(update -> {
                    listing.setTitle(update.getTitle());
                    listing.setDescription(update.getDescription());
                    listing.setPrice(update.getPrice());
                    listing.setCategory(update.getCategory());
                    listing.setDeliveryAddress(update.getDeliveryAddress());
                    listing.setConditionLevel(update.getConditionLevel());

                    // Đánh dấu bản cập nhật đã được xử lý
                    update.setStatus(ListingUpdateStatus.APPROVED);
                    update.setProcessedAt(LocalDateTime.now());
                    listingUpdateRepository.save(update);
                });



        listing.setStatus(ListingStatus.ACTIVE);

        SellerPackage pkg = listing.getSellerPackage();

        if (pkg == null) {
            // FREE — trừ lượt đăng miễn phí khi được duyệt
            User seller = listing.getSeller();
            // Chỉ trừ lượt đăng cho bài mới
            if (listing.getIsNewPost() == null || Boolean.TRUE.equals(listing.getIsNewPost())) {
                if (seller.getFreePostsRemaining() <= 0) {
                    throw new RuntimeException("Người bán đã hết lượt đăng miễn phí");
                }
                seller.setFreePostsRemaining(seller.getFreePostsRemaining() - 1);
                userRepository.save(seller);
            }

        } else {
            // PACKAGE — trừ lượt đăng và kích hoạt đẩy tin khi được duyệt
            if (pkg.getRemainingPosts() <= 0) {
                throw new RuntimeException("Gói đã hết lượt đăng");
            }

            // Chỉ trừ lượt đăng cho bài mới, không trừ khi duyệt lại bài đã cập nhật
            if (listing.getIsNewPost() == null || Boolean.TRUE.equals(listing.getIsNewPost())) {
                pkg.setRemainingPosts(
                        pkg.getRemainingPosts() - 1
                );
            }

            // Chỉ trừ lượt đẩy và kích hoạt đẩy khi bài đăng được nâng cấp gói
            if (Boolean.TRUE.equals(listing.getPackageUpgraded()) && pkg.getRemainingPushes() > 0) {
                listing.setLastPushAt(LocalDateTime.now());
                pkg.setRemainingPushes(pkg.getRemainingPushes() - 1);
            }

            // Nếu gói hết cả lượt đăng và lượt đẩy, thì hết hạn
            if (pkg.getRemainingPosts() <= 0 && pkg.getRemainingPushes() <= 0 && pkg.getStatus() == PackageStatus.ACTIVE) {
                pkg.setStatus(PackageStatus.EXPIRED);
            }

            listing.setPackageUpgraded(false);

            sellerPackageRepository.save(pkg);
        }

        listing.setIsNewPost(false); // Sau khi duyệt, nó không còn là bài mới nữa
        listingRepository.save(listing);

        // Thông báo cho người bán
        Notification notification = Notification.builder()
                .user(listing.getSeller())
                .content("Bài đăng '" + listing.getTitle() + "' của bạn đã được duyệt.")
                .type(NotificationType.SYSTEM)
                .referenceId(listing.getId())
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    // Cập nhật trạng thái thành REJECTED
    public void rejectListing(Integer id, String reason) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài đăng"));
        listing.setStatus(ListingStatus.REJECTED);
        listing.setRejectReason(reason);

        // Đánh dấu bản cập nhật đang chờ là đã bị từ chối
        listingUpdateRepository.findFirstByListingIdAndStatusOrderByCreatedAtDesc(id, ListingUpdateStatus.PENDING)
                .ifPresent(update -> {
                    update.setStatus(ListingUpdateStatus.REJECTED);
                    update.setProcessedAt(LocalDateTime.now());
                    listingUpdateRepository.save(update);
                });
        
        listingRepository.save(listing);

        // Gửi thông báo đến người đăng
        Notification notification = Notification.builder()
                .user(listing.getSeller())
                .content("Bài đăng '" + listing.getTitle() + "' của bạn đã bị từ chối. Lý do: " + reason)
                .type(NotificationType.SYSTEM)
                .referenceId(listing.getId())
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    // Hàm ánh xạ sang ListingDetailResponse dùng cho màn hình Kiểm duyệt
    private ListingDetailResponse toDetailResponse(Listing listing) {
        List<String> imageUrls = listing.getImages() == null
                ? List.of()
                : listing.getImages().stream().map(image -> image.getUrl()).toList();

        Boolean isVerified = listing.getSeller() != null && Boolean.TRUE.equals(listing.getSeller().getIsVerified());
        
        String packageName = (listing.getSellerPackage() != null && listing.getSellerPackage().getPackagePlan() != null)
                ? listing.getSellerPackage().getPackagePlan().getName()
                : null;

        // Nếu đang chờ duyệt, ưu tiên hiển thị nội dung đang chờ
        Optional<ListingUpdate> pendingUpdateOpt = listing.getStatus() == ListingStatus.PENDING
                ? listingUpdateRepository.findFirstByListingIdAndStatusOrderByCreatedAtDesc(listing.getId(), ListingUpdateStatus.PENDING)
                : Optional.empty();

        String title = pendingUpdateOpt.map(update -> update.getTitle()).orElse(listing.getTitle());
        String description = pendingUpdateOpt.map(update -> update.getDescription()).orElse(listing.getDescription());
        java.math.BigDecimal price = pendingUpdateOpt.map(update -> update.getPrice()).orElse(listing.getPrice());
        Category category = pendingUpdateOpt.map(update -> update.getCategory()).orElse(listing.getCategory());
        String deliveryAddress = pendingUpdateOpt.map(update -> update.getDeliveryAddress()).orElse(listing.getDeliveryAddress());
        String conditionLevel = pendingUpdateOpt.map(update -> update.getConditionLevel()).orElse(listing.getConditionLevel());


        return ListingDetailResponse.builder()
                .id(listing.getId())
                .title(title)
                .categoryId(category != null ? category.getId() : null)
                .categoryName(category != null ? category.getName() : null)
                .price(price)
                .deliveryAddress(deliveryAddress)
                .conditionLevel(conditionLevel)
                .description(description)
                .status(listing.getStatus() != null ? listing.getStatus().name() : ListingStatus.ACTIVE.name())
                .imageUrls(imageUrls)
                .sellerName(listing.getSeller() != null ? listing.getSeller().getFullName() : null)
                .sellerUniversity(listing.getSeller() != null ? listing.getSeller().getUniversity() : null)
                .isVerified(isVerified)
                .thumbnailUrl(!imageUrls.isEmpty() ? imageUrls.get(0) : null)
                .createdAt(listing.getCreatedAt())
                .rejectReason(listing.getRejectReason())
                .sellerId(listing.getSeller() != null ? listing.getSeller().getId() : null)
                .sellerAvatar(listing.getSeller() != null ? listing.getSeller().getAvatar() : null)
                .packageName(packageName)
                .build();
    }

    // Hàm ánh xạ Entity sang DTO
    private ListingSummaryResponse toSummaryResponse(Listing listing) {
        Boolean isVerified = listing.getSeller() != null && Boolean.TRUE.equals(listing.getSeller().getIsVerified());
        String thumbnail = listing.getImages() != null && !listing.getImages().isEmpty()
                ? listing.getImages().get(0).getUrl()
                : null;

        String packageName = (listing.getSellerPackage() != null && listing.getSellerPackage().getPackagePlan() != null)
                ? listing.getSellerPackage().getPackagePlan().getName()
                : null;

        ListingSummaryResponse response = new ListingSummaryResponse();
        response.setId(listing.getId());
        response.setTitle(listing.getTitle());
        response.setPrice(listing.getPrice());
        response.setSellerName(listing.getSeller() != null ? listing.getSeller().getFullName() : null);
        response.setSellerUniversity(listing.getSeller() != null ? listing.getSeller().getUniversity() : null);
        response.setIsVerified(isVerified);
        response.setStatus(listing.getStatus() != null ? listing.getStatus().name() : ListingStatus.ACTIVE.name());
        response.setThumbnailUrl(thumbnail);
        response.setCreatedAt(listing.getCreatedAt());
        response.setPackageName(packageName);
        return response;
    }
}