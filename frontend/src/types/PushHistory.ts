export interface PushHistory {
  listingId: number;
  listingTitle: string;
  packageName: string;
  lastPushAt: string;
  pushExpiresAt: string;
  remainingPushes: number;
  canPush: boolean;
}