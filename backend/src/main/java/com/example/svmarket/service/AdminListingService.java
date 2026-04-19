package com.example.svmarket.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.svmarket.dto.ListingDetailResponse;
import com.example.svmarket.dto.ListingSummaryResponse;
import com.example.svmarket.entity.Image;
import com.example.svmarket.entity.Listing;
import com.example.svmarket.entity.ListingStatus;
import com.example.svmarket.repository.ListingRepository;

@Service
@Transactional
public class AdminListingService {

    @Autowired
    private ListingRepository listingRepository;

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
        listing.setStatus(ListingStatus.ACTIVE);
        listingRepository.save(listing);
    }

    // Cập nhật trạng thái thành REJECTED
    public void rejectListing(Integer id, String reason) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài đăng"));
        listing.setStatus(ListingStatus.REJECTED);
        listing.setRejectReason(reason);
        listingRepository.save(listing);
    }

    // Hàm ánh xạ sang ListingDetailResponse dùng cho màn hình Kiểm duyệt
    private ListingDetailResponse toDetailResponse(Listing listing) {
        List<String> imageUrls = listing.getImages() == null
                ? List.of()
                : listing.getImages().stream().map(Image::getUrl).toList();

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
                .thumbnailUrl(!imageUrls.isEmpty() ? imageUrls.get(0) : null)
                .createdAt(listing.getCreatedAt())
                .rejectReason(listing.getRejectReason())
                .build();
    }

    // Hàm ánh xạ Entity sang DTO
    private ListingSummaryResponse toSummaryResponse(Listing listing) {
        String thumbnail = listing.getImages() != null && !listing.getImages().isEmpty()
                ? listing.getImages().get(0).getUrl()
                : null;

        ListingSummaryResponse response = new ListingSummaryResponse();
        response.setId(listing.getId());
        response.setTitle(listing.getTitle());
        response.setPrice(listing.getPrice());
        response.setSellerName(listing.getSeller() != null ? listing.getSeller().getFullName() : null);
        response.setSellerUniversity(listing.getSeller() != null ? listing.getSeller().getUniversity() : null);
        response.setStatus(listing.getStatus() != null ? listing.getStatus().name() : ListingStatus.ACTIVE.name());
        response.setThumbnailUrl(thumbnail);
        response.setCreatedAt(listing.getCreatedAt());
        return response;
    }
}