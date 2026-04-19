import axios from "axios";
import { ListingSummary } from "./listingService";

const FAVORITE_API_BASE_URL = "http://localhost:8080/api/listings";
const FAVORITES_UPDATED_EVENT = "favorites-updated";

export type FavoriteToggleResponse = {
  listingId: number;
  favorited: boolean;
};

function getAuthHeader() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Vui long dang nhap de su dung tinh nang luu bai dang");
  }

  return { Authorization: `Bearer ${token}` };
}

// Lay danh sach bai dang da luu cua user dang nhap.
export async function fetchMyFavoriteListings() {
  const response = await axios.get<ListingSummary[]>(
    `${FAVORITE_API_BASE_URL}/favorites/my`,
    {
      headers: getAuthHeader(),
    },
  );

  return response.data;
}

// Lay danh sach id bai dang da luu de to mau icon tim.
export async function fetchMyFavoriteListingIds() {
  const response = await axios.get<number[]>(
    `${FAVORITE_API_BASE_URL}/favorites/my/ids`,
    {
      headers: getAuthHeader(),
    },
  );

  return response.data;
}

// Them/bo luu bai dang va phat event de dong bo UI.
export async function toggleFavoriteListing(listingId: number) {
  const response = await axios.post<FavoriteToggleResponse>(
    `${FAVORITE_API_BASE_URL}/${listingId}/favorite`,
    null,
    {
      headers: getAuthHeader(),
    },
  );

  window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT));
  return response.data;
}

export const favoritesUpdatedEvent = FAVORITES_UPDATED_EVENT;
