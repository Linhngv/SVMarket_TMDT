export interface PackagePlan {
  id: number;
  name: string;
  price: number;
  postLimit: number;
  pushLimit: number;
  pushHours: number;
  durationDays: number;
  priorityLevel: number;
}