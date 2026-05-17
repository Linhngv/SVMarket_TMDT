package com.example.svmarket.service;

import com.example.svmarket.dto.CategoryViewResponse;
import com.example.svmarket.dto.SellerDashboardResponse;
import com.example.svmarket.dto.TopListingResponse;
import com.example.svmarket.entity.*;
import com.example.svmarket.repository.ReviewRepository;
import com.example.svmarket.repository.UserRepository;
import com.example.svmarket.repository.SellerPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SellerPackageRepository sellerPackageRepository;

    public SellerDashboardResponse getSellerDashboard(String email, String startDate, String endDate) {

        User seller = getSeller(email);

        List<Listing> listings = getSellerListings(seller);

        // Parse ngày bắt đầu và kết thúc
        LocalDateTime start = (startDate != null && !startDate.trim().isEmpty()) 
                ? LocalDate.parse(startDate).atStartOfDay() : null;
        LocalDateTime end = (endDate != null && !endDate.trim().isEmpty()) 
                ? LocalDate.parse(endDate).atTime(23, 59, 59) : null;

        // Lọc danh sách bài đăng theo khoảng thời gian
        if (start != null || end != null) {
            listings = listings.stream()
                    .filter(l -> l.getCreatedAt() != null &&
                            (start == null || !l.getCreatedAt().isBefore(start)) &&
                            (end == null || !l.getCreatedAt().isAfter(end)))
                    .collect(Collectors.toList());
        }

        int activeListingCount =
                countListingsByStatus(
                        listings,
                        ListingStatus.ACTIVE);

        int soldListingCount =
                countListingsByStatus(
                        listings,
                        ListingStatus.SOLD);

        long totalViews =
                calculateTotalViews(listings);

        long normalViews = calculateViewsBySource(listings, false);

        long packageViews = calculateViewsBySource(listings, true);

        List<Review> reviews =
                reviewRepository
                        .findByRevieweeIdOrderByCreatedAtDesc(
                                seller.getId());

        // Lọc danh sách đánh giá theo khoảng thời gian
        if (start != null || end != null) {
            reviews = reviews.stream()
                    .filter(r -> r.getCreatedAt() != null &&
                            (start == null || !r.getCreatedAt().isBefore(start)) &&
                            (end == null || !r.getCreatedAt().isAfter(end)))
                    .collect(Collectors.toList());
        }

        double averageRating =
                calculateAverageRating(reviews);

        List<TopListingResponse> topListings =
                getTopListings(listings);

        List<CategoryViewResponse> categoryViews =
                getCategoryViews(listings);

        return SellerDashboardResponse.builder()
                .totalViews(totalViews)
                .activeListingCount(activeListingCount)
                .soldListingCount(soldListingCount)
                .averageRating(averageRating)
                .reviewCount(reviews.size())
                .normalViews(normalViews)
                .packageViews(packageViews)
                .topListings(topListings)
                .categoryViews(categoryViews)
                .build();
    }

    public User getSeller(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Người bán không tồn tại"));
    }


    public List<Listing> getSellerListings(User seller) {
        return seller.getListings() != null
                ? seller.getListings()
                : List.of();
    }

    // Đếm số bài đăng theo trạng thái
    public int countListingsByStatus(List<Listing> listings, ListingStatus status) {
        return (int) listings.stream()
                .filter(l -> l.getStatus() == status)
                .count();
    }

    // Tính tổng lượt xem
    public long calculateTotalViews(List<Listing> listings) {
        return listings.stream()
                .mapToLong(this::getViewCount)
                .sum();
    }

    // Tính lượt xem theo loại bài đăng
//    public long calculateViewsBySource(List<Listing> listings, PostSource source) {
//        return listings.stream()
//                .filter(l -> l.getPostSource() == source)
//                .mapToLong(this::getViewCount)
//                .sum();
//    }
    public long calculateViewsBySource(List<Listing> listings, boolean isPackage) {
        return listings.stream()
                .filter(l -> isPackage ? l.getSellerPackage() != null : l.getSellerPackage() == null)
                .mapToLong(this::getViewCount)
                .sum();
    }

    // Lấy số lượt xem của bài đăng
    public int getViewCount(Listing listing) {
        return listing.getViewCount() != null
                ? listing.getViewCount()
                : 0;
    }

    // Tính điểm đánh giá trung bình
    public double calculateAverageRating(List<Review> reviews) {
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    // Lấy danh sách top bài đăng nổi bật
    public List<TopListingResponse> getTopListings(List<Listing> listings) {
        return listings.stream()
                .sorted((a, b) -> Integer.compare(getViewCount(b), getViewCount(a)))
                .limit(5)
                .map(l -> TopListingResponse.builder()
                        .id(l.getId())
                        .title(l.getTitle())
                        .viewCount(getViewCount(l))
                        .type(l.getSellerPackage() != null ? "Gói tin" : "Tin thường")
                        .build())
                .toList();
    }

    // Lấy thống kê lượt xem theo danh mục
    public List<CategoryViewResponse> getCategoryViews(List<Listing> listings) {

        return listings.stream()
                .collect(Collectors.groupingBy(
                        l -> l.getCategory().getName()
                ))
                .entrySet()
                .stream()
                .map(entry -> {

                    String categoryName =
                            entry.getKey();

                    List<Listing> categoryListings =
                            entry.getValue();

                    long normalViews = calculateViewsBySource(listings, false);

                    long packageViews = calculateViewsBySource(listings, true);

                    return CategoryViewResponse.builder()
                            .categoryName(categoryName)
                            .normalViews(normalViews)
                            .packageViews(packageViews)
                            .build();
                })
                .toList();
    }

    // Tính tổng tiền đã chi cho các gói tin
    public long calculateTotalSpentOnPackages(String email, String startDate, String endDate) {
        User seller = getSeller(email);

        LocalDateTime start = (startDate != null && !startDate.trim().isEmpty()) 
                ? LocalDate.parse(startDate).atStartOfDay() : null;
        LocalDateTime end = (endDate != null && !endDate.trim().isEmpty()) 
                ? LocalDate.parse(endDate).atTime(23, 59, 59) : null;

        List<SellerPackage> packages = sellerPackageRepository.findBySellerId(seller.getId());

        if (start != null || end != null) {
            packages = packages.stream()
                    .filter(p -> p.getStartDate() != null &&
                            (start == null || !p.getStartDate().isBefore(start)) &&
                            (end == null || !p.getStartDate().isAfter(end)))
                    .collect(Collectors.toList());
        }

        return packages.stream()
                .mapToLong(p -> p.getPackagePlan().getPrice().longValue())
                .sum();
    }
}