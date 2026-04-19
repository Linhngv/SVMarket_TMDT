import { useEffect, useMemo, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  deleteListing,
  fetchMyListings,
  ListingSummary,
} from "../services/listingService";
import "../styles/ListingManagement.css";

const ITEMS_PER_PAGE = 5;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function getStatusBadge(status: string) {
  if (status === "SOLD") {
    return { text: "Da ban", className: "status-badge sold" };
  }

  if (status === "ACTIVE") {
    return { text: "Dang ban", className: "status-badge active" };
  }

  return { text: "Tam an", className: "status-badge inactive" };
}

export default function MyListings() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [page, setPage] = useState(1);

  // Tai danh sach bai dang cua nguoi dung khi vao trang.
  const loadListings = async () => {
    try {
      const data = await fetchMyListings();
      setListings(data);
    } catch (error) {
      console.error("Khong the tai danh sach bai dang", error);
      alert("Khong the tai danh sach bai dang");
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
      console.error("Khong the xoa bai dang", error);
      alert("Khong the xoa bai dang");
    }
  };

  return (
    <section className="listing-panel">
      <div className="listing-panel-header">
        <h2>Danh sach bai dang</h2>
      </div>

      <div className="listing-search-wrap">
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tim kiem bai dang theo tieu de"
        />
      </div>

      <div className="listing-table-wrap">
        <table className="listing-table">
          <thead>
            <tr>
              <th>Hinh anh</th>
              <th>Tieu de</th>
              <th>Gia ca</th>
              <th>Trang thai</th>
              <th>Cap nhat/Xoa</th>
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
                    <td data-label="Gia ca">{formatCurrency(listing.price)}</td>
                    <td data-label="Trang thai">
                      <span className={statusBadge.className}>
                        {statusBadge.text}
                      </span>
                    </td>

                    <td data-label="Cap nhat/Xoa">
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/my-listings/${listing.id}/edit`)
                          }
                          aria-label="Cap nhat bai dang"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDelete(listing.id)}
                          aria-label="Xoa bai dang"
                        >
                          <Trash2 size={15} />
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
