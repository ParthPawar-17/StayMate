export type GenderType = 'Boys' | 'Girls' | 'Co-living';
export type RoomSharingType = 'Single' | 'Double' | 'Triple' | '4-Sharing';
export type UserRole = 'student' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  college?: string;
  avatar?: string;
  created_at?: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
  category: 'Essentials' | 'Comfort' | 'Security' | 'Services';
}

export interface RoomOption {
  type: RoomSharingType;
  price: number;
  available: number;
  deposit: number;
}

export interface CollegeDistance {
  name: string;
  distance: string;
  travelTime: string;
}

export interface Property {
  id: number;
  name: string;
  city: string;
  location: string;
  address: string;
  price: number; // Base monthly rent starting from
  deposit: number;
  gender: GenderType;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  gallery: string[];
  roomTypes: RoomSharingType[];
  sharingOptions: RoomOption[];
  amenities: string[];
  facilities: string[];
  rules: string[];
  nearestColleges: CollegeDistance[];
  contactOwner: string;
  contactPhone: string;
  verified: boolean;
  featured: boolean;
  isPopular?: boolean;
  availableFrom?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface InterestedLead {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  propertyId: number;
  propertyName: string;
  propertyLocation: string;
  propertyPrice: number;
  propertyImage: string;
  visitDate: string;
  timeSlot: string;
  sharingPreference: string;
  status: 'Pending' | 'Contacted' | 'Visit Scheduled' | 'Confirmed';
  notes?: string;
  createdAt: string;
}

export interface PropertyReview {
  id: number;
  propertyId: number;
  userName: string;
  userCollege: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
}

export interface FilterState {
  searchTerm: string;
  city: string;
  gender: string; // 'All' | GenderType
  roomType: string; // 'All' | RoomSharingType
  minBudget: number;
  maxBudget: number;
  amenities: string[];
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | 'popular';
  collegeFilter?: string;
}
