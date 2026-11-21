export type ProductCondition = "New" | "Brand New" | "Like New" | "Good" | "Fair";

export type ListingType = "For Sale" | "Exchange" | "Free";

export type ProductStatus = "Available" | "Reserved" | "Sold";

export type ProductCategory =
  | "Books"
  | "Books & Textbooks"
  | "Electronics"
  | "Calculators"
  | "Furniture"
  | "Furniture & Room"
  | "Stationery"
  | "Sports"
  | "College Accessories"
  | "Other";

export interface SellerInfo {
  name: string;
  email: string;
  college?: string;
  year?: string;
  avatar?: string;
  phone?: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  listingType: ListingType;
  images: string[];
  seller: SellerInfo;
  status: ProductStatus;
  featured?: boolean;
  location?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  iconName: string;
  itemCount: number;
}

export interface Enquiry {
  _id?: string;
  id?: string;
  product: string | Product;
  productId?: string;
  productName?: string;
  buyerName: string;
  buyerEmail: string;
  message: string;
  status: "Pending" | "Responded" | "Closed" | "pending" | "replied" | "closed";
  createdAt: string;
  updatedAt?: string;
}

export interface Offer {
  _id?: string;
  id?: string;
  product: string | Product;
  productId?: string;
  productName?: string;
  buyerName: string;
  buyerEmail: string;
  offeredPrice: number;
  message?: string;
  status: "Pending" | "Accepted" | "Rejected" | "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt?: string;
}

export interface Favorite {
  _id?: string;
  id?: string;
  userId: string;
  productId: string | Product;
  product?: Product;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  pendingEnquiries: number;
  pendingOffers: number;
  totalActiveValue: number;
  recentListings: Product[];
  recentEnquiries: Enquiry[];
  recentOffers: Offer[];
}

export interface FilterState {
  search: string;
  category: string;
  condition: string;
  listingType: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}
