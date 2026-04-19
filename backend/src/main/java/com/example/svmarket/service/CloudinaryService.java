package com.example.svmarket.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // Upload mot anh len Cloudinary va tra ve public_id + secure_url.
    public UploadedImage uploadListingImage(MultipartFile file) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "svmarket/listings",
                            "resource_type", "image"));

            String publicId = (String) result.get("public_id");
            String secureUrl = (String) result.get("secure_url");

            return new UploadedImage(publicId, secureUrl);
        } catch (IOException exception) {
            throw new RuntimeException("Khong the upload anh len Cloudinary", exception);
        }
    }

    // Xoa mot anh tren Cloudinary theo public_id.
    public void deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException exception) {
            throw new RuntimeException("Khong the xoa anh tren Cloudinary", exception);
        }
    }

    public record UploadedImage(String publicId, String secureUrl) {
    }
}
