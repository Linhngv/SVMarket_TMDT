package com.example.svmarket.service;

import com.example.svmarket.dto.CategoryOptionResponse;
import com.example.svmarket.dto.ListingDetailResponse;
import com.example.svmarket.dto.ListingSummaryResponse;
import com.example.svmarket.dto.ListingUpsertRequest;
import com.example.svmarket.entity.Category;
import com.example.svmarket.entity.Image;
import com.example.svmarket.entity.Listing;
import com.example.svmarket.entity.ListingStatus;
import com.example.svmarket.entity.User;
import com.example.svmarket.exception.BadRequestException;
import com.example.svmarket.repository.CategoryRepository;
import com.example.svmarket.repository.ImageRepository;
import com.example.svmarket.repository.ListingRepository;
import com.example.svmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ListingService {

    private static final int MAX_IMAGES = 5;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageRepository imageRepository;

    // Lay danh sach danh muc de hien thi dropdown o form.
    public List<CategoryOptionResponse> getCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryOptionResponse(category.getId(), category.getName()))
                .toList();
    }

    // Tao bai dang moi cua user dang dang nhap.
    @Transactional
    public ListingDetailResponse createMyListing(String email, ListingUpsertRequest request, List<MultipartFile> images) {
        User seller = getUserByEmail(email);
        Category category = getCategoryById(request.getCategoryId());

        Listing listing = Listing.builder()
                .seller(seller)
                .category(category)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .price(request.getPrice())
                .deliveryAddress(request.getDeliveryAddress())
                .conditionLevel(request.getConditionLevel())
                .status(parseStatus(request.getStatus()))
                .stock(1)
                .build();

        Listing savedListing = listingRepository.save(listing);
        List<String> imageUrls = saveImages(savedListing, images);

        return toDetailResponse(savedListing, imageUrls);
    }

    // Lay danh sach bai dang cua user hien tai.
    public List<ListingSummaryResponse> getMyListings(String email) {
        User seller = getUserByEmail(email);

        return listingRepository.findBySellerIdAndStatusNotOrderByCreatedAtDesc(seller.getId(), ListingStatus.DELETED)
                .stream()
                .map(listing -> {
                    String thumbnail = listing.getImages() != null && !listing.getImages().isEmpty()
                            ? listing.getImages().get(0).getUrl()
                            : null;

                    return new ListingSummaryResponse(
                            listing.getId(),
                            listing.getTitle(),
                            listing.getPrice(),
                            listing.getStatus().name(),
                            thumbnail);
                })
                .toList();
    }

    // Lay chi tiet mot bai dang cua user hien tai de hien thi va sua.
    public ListingDetailResponse getMyListingById(String email, Integer listingId) {
        User seller = getUserByEmail(email);
        Listing listing = getMyListingByIdAndSellerId(listingId, seller.getId());

        List<String> imageUrls = listing.getImages() == null
                ? List.of()
                : listing.getImages().stream().map(Image::getUrl).toList();

        return toDetailResponse(listing, imageUrls);
    }

    // Cap nhat bai dang cua user hien tai, co the thay anh moi.
    @Transactional
    public ListingDetailResponse updateMyListing(String email,
                                                 Integer listingId,
                                                 ListingUpsertRequest request,
                                                 List<MultipartFile> images) {
        User seller = getUserByEmail(email);
        Listing listing = getMyListingByIdAndSellerId(listingId, seller.getId());

        Category category = getCategoryById(request.getCategoryId());

        listing.setTitle(request.getTitle().trim());
        listing.setCategory(category);
        listing.setPrice(request.getPrice());
        listing.setDeliveryAddress(request.getDeliveryAddress());
        listing.setConditionLevel(request.getConditionLevel());
        listing.setDescription(request.getDescription());
        listing.setStatus(parseStatus(request.getStatus()));

        List<String> imageUrls;

        if (images != null && !images.isEmpty() && images.stream().anyMatch(file -> !file.isEmpty())) {
            imageRepository.deleteByListingId(listing.getId());
            imageUrls = saveImages(listing, images);
        } else {
            imageUrls = listing.getImages() == null
                    ? List.of()
                    : listing.getImages().stream().map(Image::getUrl).toList();
        }

        Listing updatedListing = listingRepository.save(listing);
        return toDetailResponse(updatedListing, imageUrls);
    }

    // Xoa mem bai dang de van giu lai du lieu giao dich.
    @Transactional
    public void deleteMyListing(String email, Integer listingId) {
        User seller = getUserByEmail(email);
        Listing listing = getMyListingByIdAndSellerId(listingId, seller.getId());

        listing.setStatus(ListingStatus.DELETED);
        listingRepository.save(listing);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Khong tim thay user"));
    }

    private Category getCategoryById(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BadRequestException("Danh muc khong ton tai"));
    }

    private Listing getMyListingByIdAndSellerId(Integer listingId, Integer sellerId) {
        return listingRepository.findByIdAndSellerId(listingId, sellerId)
                .orElseThrow(() -> new BadRequestException("Bai dang khong ton tai hoac ban khong co quyen"));
    }

    private ListingStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return ListingStatus.ACTIVE;
        }

        try {
            return ListingStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Trang thai bai dang khong hop le");
        }
    }

    private ListingDetailResponse toDetailResponse(Listing listing, List<String> imageUrls) {
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
                .build();
    }

    private List<String> saveImages(Listing listing, List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            return List.of();
        }

        List<MultipartFile> validImages = images.stream()
                .filter(file -> file != null && !file.isEmpty())
                .toList();

        if (validImages.size() > MAX_IMAGES) {
            throw new BadRequestException("Chi duoc tai len toi da 5 anh" );
        }

        Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads", "listings");

        try {
            Files.createDirectories(uploadPath);

            List<String> imageUrls = new ArrayList<>();
            List<Image> imageEntities = new ArrayList<>();

            for (MultipartFile file : validImages) {
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    throw new BadRequestException("Tat ca file phai la hinh anh");
                }

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);

                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                String url = "/uploads/listings/" + fileName;
                imageUrls.add(url);

                imageEntities.add(Image.builder()
                        .url(url)
                        .listing(listing)
                        .build());
            }

            imageRepository.saveAll(imageEntities);
            return imageUrls;
        } catch (IOException e) {
            throw new RuntimeException("Khong the luu anh bai dang", e);
        }
    }
}
