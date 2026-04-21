export interface OrderDetail {
  orderId: number;
  buyerName: string;
  sellerName: string;
  totalAmount: number;
  status: string;
  createdAt: any;
  paymentStatus: string;
  paymentMethod: string | null;
  paidAt: any;
  items: {
    listingTitle: string;
    quantity: number;
    price: number;
    note: string;
  }[];
}