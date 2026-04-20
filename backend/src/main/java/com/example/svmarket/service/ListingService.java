package com.example.svmarket.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.svmarket.dto.CategoryOptionResponse;
import com.example.svmarket.dto.FavoriteToggleResponse;
import com.example.svmarket.dto.ListingDetailResponse;
import com.example.svmarket.dto.ListingSummaryResponse;
import com.example.svmarket.dto.ListingUpsertRequest;
import com.example.svmarket.entity.Category;
import com.example.svmarket.entity.Image;
import com.example.svmarket.entity.Listing;
import com.example.svmarket.entity.ListingFavorite;
import com.example.svmarket.entity.ListingStatus;
import com.example.svmarket.entity.Notification;
import com.example.svmarket.entity.NotificationType;
import com.example.svmarket.entity.Role;
import com.example.svmarket.entity.User;
import com.example.svmarket.exception.BadRequestException;
import com.example.svmarket.repository.CategoryRepository;
import com.example.svmarket.repository.ImageRepository;
import com.example.svmarket.repository.ListingFavoriteRepository;
import com.example.svmarket.repository.ListingRepository;
import com.example.svmarket.repository.NotificationRepository;
import com.example.svmarket.repository.UserRepository;
import com.example.svmarket.service.CloudinaryService.UploadedImage;

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

    @Autowired
    private ListingFavoriteRepository listingFavoriteRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Lay danh sach danh muc de hien thi dropdown o form.
    public List<CategoryOptionResponse> getCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryOptionResponse(category.getId(), category.getName(), category.getImage()))
                .toList();
    }

    // Tao bai dang moi cua user dang dang nhap.
    @Transactional
    public ListingDetailResponse createMyListing(String email, ListingUpsertRequest request,
            List<MultipartFile> images) {
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
                .status(ListingStatus.PENDING) // Bắt buộc chờ duyệt khi đăng mới
                .stock(1)
                .build();

        Listing savedListing = listingRepository.save(listing);
        List<String> imageUrls = saveImages(savedListing, images);

        // Tạo thông báo cho Admin
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        for (User admin : admins) {
            Notification notification = Notification.builder()
                    .user(admin)
                    .content("Có bài đăng mới cần kiểm duyệt: " + savedListing.getTitle())
                    .type(NotificationType.SYSTEM)
                    .referenceId(savedListing.getId())
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        }

        return toDetailResponse(savedListing, imageUrls);
    }

    // Lay danh sach bai dang cua user hien tai.
    public List<ListingSummaryResponse> getMyListings(String email) {
        User seller = getUserByEmail(email);

        return listingRepository.findBySellerIdAndStatusNotOrderByCreatedAtDesc(seller.getId(), ListingStatus.DELETED)
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    // Lay danh sach bai dang dang hoat dong de hien thi o trang chu.
    public List<ListingSummaryResponse> getActiveListings() {
        return listingRepository.findByStatusOrderByCreatedAtDesc(ListingStatus.ACTIVE)
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    // Them/bo luu bai dang theo user dang nhap.
    @Transactional
    public FavoriteToggleResponse toggleFavoriteListing(String email, Integer listingId) {
        User user = getUserByEmail(email);
        Listing listing = listingRepository.findByIdAndStatus(listingId, ListingStatus.ACTIVE)
                .orElseThrow(() -> new BadRequestException("Bai dang khong ton tai hoac da bi an"));

        return listingFavoriteRepository.findByUserIdAndListingId(user.getId(), listing.getId())
                .map(existingFavorite -> {
                    listingFavoriteRepository.delete(existingFavorite);
                    return new FavoriteToggleResponse(listingId, false);
                })
                .orElseGet(() -> {
                    ListingFavorite favorite = ListingFavorite.builder()
                            .user(user)
                            .listing(listing)
                            .build();
                    listingFavoriteRepository.save(favorite);
                    return new FavoriteToggleResponse(listingId, true);
                });
    }

    // Lay danh sach bai dang da luu cua user dang nhap.
    public List<ListingSummaryResponse> getMyFavoriteListings(String email) {
        User user = getUserByEmail(email);

        return listingFavoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(ListingFavorite::getListing)
                .filter(listing -> listing != null && listing.getStatus() == ListingStatus.ACTIVE)
                .map(this::toSummaryResponse)
                .toList();
    }

    // Lay danh sach id bai dang da luu de to mau icon tim tren UI.
    public List<Integer> getMyFavoriteListingIds(String email) {
        User user = getUserByEmail(email);

        return listingFavoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(ListingFavorite::getListing)
                .filter(listing -> listing != null && listing.getStatus() == ListingStatus.ACTIVE)
                .map(Listing::getId)
                .distinct()
                .toList();
    }

    // Lay chi tiet mot bai dang hoat dong de hien thi trang san pham.
    public ListingDetailResponse getActiveListingById(Integer listingId) {
        Listing listing = listingRepository.findByIdAndStatus(listingId, ListingStatus.ACTIVE)
                .orElseThrow(() -> new BadRequestException("Bai dang khong ton tai hoac da bi an"));

        List<String> imageUrls = listing.getImages() == null
                ? List.of()
                : listing.getImages().stream().map(Image::getUrl).toList();

        return toPublicDetailResponse(listing, imageUrls);
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
            // Xoa anh cu tren Cloudinary truoc khi thay bo anh moi.
            List<Image> oldImages = imageRepository.findByListingId(listing.getId());
            oldImages.forEach(oldImage -> cloudinaryService.deleteImage(oldImage.getPublicId()));
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

    private ListingDetailResponse toPublicDetailResponse(Listing listing, List<String> imageUrls) {
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
                .build();
    }

    private ListingSummaryResponse toSummaryResponse(Listing listing) {
        String thumbnail = listing.getImages() != null && !listing.getImages().isEmpty()
                ? listing.getImages().get(0).getUrl()
                : null;

        ListingSummaryResponse response = new ListingSummaryResponse();
        response.setId(listing.getId());
        response.setTitle(listing.getTitle());
        response.setPrice(listing.getPrice());
        response.setStatus(listing.getStatus() != null ? listing.getStatus().name() : ListingStatus.ACTIVE.name());
        response.setThumbnailUrl(thumbnail);
        response.setSellerUniversity(listing.getSeller() != null ? listing.getSeller().getUniversity() : null);
        response.setSellerName(listing.getSeller() != null ? listing.getSeller().getFullName() : null);
        response.setCreatedAt(listing.getCreatedAt());
        return response;
    }

    // Luu danh sach anh bai dang len Cloudinary va DB.
    private List<String> saveImages(Listing listing, List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            return List.of();
        }

        List<MultipartFile> validImages = images.stream()
                .filter(file -> file != null && !file.isEmpty())
                .toList();

        if (validImages.size() > MAX_IMAGES) {
            throw new BadRequestException("Chi duoc tai len toi da 5 anh");
        }

        List<String> imageUrls = new ArrayList<>();
        List<Image> imageEntities = new ArrayList<>();

        for (MultipartFile file : validImages) {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new BadRequestException("Tat ca file phai la hinh anh");
            }

            UploadedImage uploadedImage = cloudinaryService.uploadListingImage(file);
            String url = uploadedImage.secureUrl();
            imageUrls.add(url);

            imageEntities.add(Image.builder()
                    .url(url)
                    .publicId(uploadedImage.publicId())
                    .listing(listing)
                    .build());
        }

        imageRepository.saveAll(imageEntities);
        return imageUrls;
    }
}
