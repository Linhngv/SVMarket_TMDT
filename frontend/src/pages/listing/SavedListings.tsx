import React, { useEffect, useState } from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import {
  fetchMyFavoriteListings,
  toggleFavoriteListing,
} from "../../services/favoriteService";
import { ListingSummary } from "../../services/listingService";
import "../../styles/user/ListingManagement.css";

const SavedListings: React.FC = () => {
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const loadListings = () => {
    fetchMyFavoriteListings()
      .then((data) => setListings(data))
      .catch(() => setListings([]));
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleUnfavorite = async (listingId: number) => {
    setRemovingId(listingId);
    try {
      await toggleFavoriteListing(listingId);
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (e) {
      alert("Có lỗi khi bỏ lưu bài đăng!");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <Header />
      <div className="saved-listings-main-wrapper">
        <div className="saved-listings-container saved-listings-wide">
          <h2 className="saved-listings-title">
            Bài đăng đã lưu ({listings.length}/50)
          </h2>
          <div className="saved-listings-list">
            {listings.length === 0 ? (
              <div className="saved-listings-empty-large">
                Chưa có bài đăng nào được lưu.
              </div>
            ) : (
              listings.map((listing) => {
                const imageUrl = listing.thumbnailUrl
                  ? listing.thumbnailUrl.startsWith("http")
                    ? listing.thumbnailUrl
                    : `http://localhost:8080${listing.thumbnailUrl}`
                  : "/images/detail.png";
                return (
                  <div className="saved-listing-row" key={listing.id}>
                    <img
                      src={imageUrl}
                      alt={listing.title}
                      className="saved-listing-img"
                    />
                    <div className="saved-listing-content">
                      <div className="saved-listing-title">{listing.title}</div>
                      <div className="saved-listing-price">
                        {listing.price?.toLocaleString()}đ
                      </div>
                      <div className="saved-listing-meta">
                        <span className="saved-listing-meta-author">
                          {listing.sellerName || ""}
                        </span>
                        <span className="saved-listing-meta-date">
                          30 phút trước
                        </span>
                        <span className="saved-listing-meta-university">
                          {listing.sellerUniversity || ""}
                        </span>
                      </div>
                    </div>
                    <div className="saved-listing-actions">
                      <button className="chat-btn">Chat</button>
                      <span
                        className="heart-icon heart-icon-active"
                        style={{
                          cursor:
                            removingId === listing.id ? "wait" : "pointer",
                          opacity: removingId === listing.id ? 0.5 : 1,
                        }}
                        onClick={() => handleUnfavorite(listing.id)}
                        title="Bỏ lưu bài đăng"
                      >
                        ❤️
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SavedListings;
