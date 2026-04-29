import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Pencil, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  deleteListing,
  fetchMyListings,
  ListingSummary,
} from "../../services/listingService";
import "../../styles/user/ListingManagement.css";
import { useAuth } from "../../context/AuthContext";

const ITEMS_PER_PAGE = 5;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function getStatusBadge(status: string) {
  if (status === "SOLD") {
    return { text: "Đã bán", className: "status-badge sold" };
  }

  if (status === "ACTIVE") {
    return { text: "Đang bán", className: "status-badge active" };
  }

  return { text: "Tạm ẩn", className: "status-badge inactive" };
}

// const STATUS_OPTIONS = [
//   { value: "ACTIVE", label: "Đang bán", className: "active" },
//   { value: "SOLD", label: "Đã bán", className: "sold" },
//   { value: "INACTIVE", label: "Tạm ẩn", className: "inactive" },
// ];

export default function MyListings() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [page, setPage] = useState(1);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const { token } = useAuth();
  const [postInfo, setPostInfo] = useState<any>(null);

  useEffect(() => {
    loadListings();

    const fetchPostLimit = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/listings/post-limit",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();
        setPostInfo(data);
      } catch (err) {
        console.error("Lỗi lấy post limit", err);
      }
    };

    fetchPostLimit();
  }, []);
  // Tai danh sach bai dang cua nguoi dung khi vao trang.
  const loadListings = async () => {
    try {
      const data = await fetchMyListings();
      setListings(data);
    } catch (error) {
      console.error("Không thể tải danh sách bài đăng", error);
      alert("Không thể tải danh sách bài đăng");
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const filteredListings = useMemo(
    () =>
      listings.filter((listing) =>
        listing.title.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [listings, search],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredListings.length / ITEMS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredListings]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // Xoa bai dang va tai lai danh sach de giao dien cap nhat ngay.
  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm(
      "Ban co chac muon xoa bai dang nay khong?",
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteListing(id);
      await loadListings();
    } catch (error) {
      console.error("Không thể xóa bài đăng", error);
      alert("Không thể xóa bài đăng");
    }
  };

  // const handleStatusChange = async (listingId: number, nextStatus: string) => {
  //   if (updatingStatusId === listingId) {
  //     return;
  //   }

  //   setUpdatingStatusId(listingId);

  //   try {
  //     const listingDetail = await fetchMyListingById(listingId);
  //     await updateListing(listingId, {
  //       title: listingDetail.title,
  //       categoryId: listingDetail.categoryId,
  //       price: listingDetail.price,
  //       deliveryAddress: listingDetail.deliveryAddress,
  //       conditionLevel: listingDetail.conditionLevel,
  //       description: listingDetail.description,
  //       status: nextStatus,
  //       images: [],
  //       postSource: listingDetail.postSource
  //     });
  //     await loadListings();
  //   } catch (error) {
  //     console.error("Không thể cập nhật trạng thái", error);
  //     alert("Không thể cập nhật trạng thái");
  //   } finally {
  //     setUpdatingStatusId(null);
  //     setOpenStatusMenuId(null);
  //   }
  // };

  return (
    <section className="listing-panel">
      <div className="listing-panel-header">
        <h2>Danh sách bài đăng</h2>
      </div>

      <div className="search-bar">
        <Search size={15} className="search-icon" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm kiếm theo tiêu đề"
          className="search-input"
        />
      </div>

      <div className="listing-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tiêu đề</th>
              <th>Giá cả</th>
              <th>Trạng thái</th>
              <th>Chỉnh sửa/Xóa</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-row">
                  Chua co bai dang nao
                </td>
              </tr>
            ) : (
              pageItems.map((listing) => {
                const statusBadge = getStatusBadge(listing.status);

                return (
                  <tr key={listing.id}>
                    <td data-label="Hinh anh">
                      <div className="listing-thumb">
                        {listing.thumbnailUrl ? (
                          <img
                            src={
                              listing.thumbnailUrl.startsWith("http")
                                ? listing.thumbnailUrl
                                : `http://localhost:8080${listing.thumbnailUrl}`
                            }
                            alt={listing.title}
                          />
                        ) : (
                          <div className="listing-thumb-placeholder">IMG</div>
                        )}
                      </div>
                    </td>

                    <td data-label="Tieu de">{listing.title}</td>
                    <td data-label="Gia ca">
                      {formatCurrency(listing.price)}đ
                    </td>
                    <td data-label="Trang thai">
                      <div className="status-cell">
                        <button
                          type="button"
                          className={`status-badge status-toggle ${statusBadge.className} ${updatingStatusId === listing.id ? "loading" : ""}`}
                          onClick={() =>
                            setOpenStatusMenuId((currentOpenId) =>
                              currentOpenId === listing.id ? null : listing.id,
                            )
                          }
                          disabled={updatingStatusId === listing.id}
                          aria-haspopup="menu"
                          aria-expanded={openStatusMenuId === listing.id}
                          aria-label={`Cap nhat trang thai bai dang ${listing.title}`}
                        >
                          <span>{statusBadge.text}</span>
                          {/* <ChevronDown size={14} /> */}
                        </button>

                        {/* {openStatusMenuId === listing.id ? (
                          <div className="status-menu" role="menu">
                            {STATUS_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                className={`status-menu-item ${option.className}`}
                                onClick={() =>
                                  handleStatusChange(listing.id, option.value)
                                }
                                role="menuitem"
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        ) : null} */}
                      </div>
                    </td>

                    <td data-label="Cap nhat/Xoa">
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/my-listings/${listing.id}/edit`)
                          }
                          aria-label="Cập nhật bài đăng"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDelete(listing.id)}
                          aria-label="Xóa bài đăng"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="listing-pagination">
        <button
          type="button"
          className="outline"
          disabled={currentPage === 1}
          onClick={() => setPage((previous) => Math.max(1, previous - 1))}
        >
          Truoc
        </button>

        <span>
          Trang {currentPage}/{totalPages}
        </span>

        <button
          type="button"
          className="filled"
          disabled={currentPage === totalPages}
          onClick={() =>
            setPage((previous) => Math.min(totalPages, previous + 1))
          }
        >
          Ke tiep
        </button>
      </div>
    </section>
  );
}
