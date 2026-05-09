import { TopListingResponse } from "./TopListingResponse";
import { CategoryViewResponse } from "./CategoryViewResponse";

export type SellerDashboardResponse = {
    totalViews: number;
    activeListingCount: number;
    soldListingCount: number;
    averageRating: number;
    reviewCount: number;

    normalViews: number;
    packageViews: number;

    topListings: TopListingResponse[];
    categoryViews: CategoryViewResponse[];
};
