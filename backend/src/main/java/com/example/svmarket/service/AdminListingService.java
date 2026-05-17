package com.example.svmarket.service;

import java.time.LocalDateTime;
import java.util.List;

import com.example.svmarket.entity.*;
import com.example.svmarket.repository.SellerPackageRepository;
import com.example.svmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.svmarket.dto.ListingDetailResponse;
import com.example.svmarket.dto.ListingSummaryResponse;
import com.example.svmarket.repository.ListingRepository;
import com.example.svmarket.repository.NotificationRepository;

@Service
@Transactional
public class AdminListingService {

    @Autowired
    private ListingRepository listingRepository;

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

    // Cập nhật trạng thái thành ACTIVE
    public void approveListing(Integer id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài đăng"));

        if (listing.getStatus() == ListingStatus.ACTIVE) return;

        listing.setStatus(ListingStatus.ACTIVE);

        SellerPackage pkg = listing.getSellerPackage();

        if (pkg == null) {
            // FREE — trừ lượt đăng miễn phí khi được duyệt
            User seller = listing.getSeller();
            if (seller.getFreePostsRemaining() <= 0) {
                throw new RuntimeException("Người bán đã hết lượt đăng miễn phí");
            }
            seller.setFreePostsRemaining(seller.getFreePostsRemaining() - 1);
            userRepository.save(seller);

        } else {
            // PACKAGE — trừ lượt đăng và kích hoạt đẩy tin khi được duyệt
            if (pkg.getRemainingPosts() <= 0) {
                throw new RuntimeException("Gói đã hết lượt đăng");
            }

            if (!Boolean.TRUE.equals(listing.getPackageUpgraded())) {

                pkg.setRemainingPosts(
                        pkg.getRemainingPosts() - 1
                );
            }

            if (pkg.getRemainingPushes() > 0) {
                listing.setLastPushAt(LocalDateTime.now());
                pkg.setRemainingPushes(pkg.getRemainingPushes() - 1);
            }

            if (pkg.getRemainingPosts() <= 0 && pkg.getRemainingPushes() <= 0) {
                pkg.setStatus(PackageStatus.EXPIRED);
            }

            listing.setPackageUpgraded(false);
            sellerPackageRepository.save(pkg);
        }

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
                : listing.getImages().stream().map(Image::getUrl).toList();

        Boolean isVerified = listing.getSeller() != null && Boolean.TRUE.equals(listing.getSeller().getIsVerified());
        return ListingDetailResponse.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .categoryId(listing.getCategory() != null ? listing.getCategory().getId() : null)
                .categoryName(listing.getCategory() != null ? listing.getCategory().getName() : null)
                .price(listing.getPrice())
                .deliveryAddress(listing.getDeliveryAddress())
                .conditionLevel(listing.getConditionLevel())
                .description(listing.getDescription())
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
                .build();
    }

    // Hàm ánh xạ Entity sang DTO
    private ListingSummaryResponse toSummaryResponse(Listing listing) {
        Boolean isVerified = listing.getSeller() != null && Boolean.TRUE.equals(listing.getSeller().getIsVerified());
        String thumbnail = listing.getImages() != null && !listing.getImages().isEmpty()
                ? listing.getImages().get(0).getUrl()
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
        return response;
    }
}