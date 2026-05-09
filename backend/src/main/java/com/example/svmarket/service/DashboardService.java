package com.example.svmarket.service;

import com.example.svmarket.dto.CategoryViewResponse;
import com.example.svmarket.dto.SellerDashboardResponse;
import com.example.svmarket.dto.TopListingResponse;
import com.example.svmarket.entity.*;
import com.example.svmarket.repository.ReviewRepository;
import com.example.svmarket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public SellerDashboardResponse getSellerDashboard(String email) {

        User seller = getSeller(email);

        List<Listing> listings = getSellerListings(seller);

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

        long normalViews =
                calculateViewsBySource(
                        listings,
                        PostSource.FREE);

        long packageViews =
                calculateViewsBySource(
                        listings,
                        PostSource.PACKAGE);

        List<Review> reviews =
                reviewRepository
                        .findByRevieweeIdOrderByCreatedAtDesc(
                                seller.getId());

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
    public long calculateViewsBySource(List<Listing> listings, PostSource source) {
        return listings.stream()
                .filter(l -> l.getPostSource() == source)
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
                .sorted((a, b) ->
                        Integer.compare(
                                getViewCount(b),
                                getViewCount(a)
                        ))
                .limit(5)
                .map(l -> TopListingResponse.builder()
                        .id(l.getId())
                        .title(l.getTitle())
                        .viewCount(getViewCount(l))
                        .type(
                                l.getPostSource()
                                        == PostSource.PACKAGE
                                        ? "Gói tin"
                                        : "Tin thường"
                        )
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

                    long normalViews =
                            calculateViewsBySource(
                                    categoryListings,
                                    PostSource.FREE);

                    long packageViews =
                            calculateViewsBySource(
                                    categoryListings,
                                    PostSource.PACKAGE);

                    return CategoryViewResponse.builder()
                            .categoryName(categoryName)
                            .normalViews(normalViews)
                            .packageViews(packageViews)
                            .build();
                })
                .toList();
    }
}