export interface SellerPackage {
  id: number;
  packageName: string;
  remainingPosts: number;
  remainingPushes: number;
  postLimit: number;
  pushLimit: number;
  startDate: string;
  endDate: string;
}