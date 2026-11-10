import { Property, FilterState } from '../types';

/**
 * Filter properties based on user-selected criteria
 */
export function filterProperties(properties: Property[], filters: FilterState): Property[] {
  return properties.filter((prop) => {
    // 1. Search term match (Name, location, address, city, description)
    if (filters.searchTerm.trim() !== '') {
      const term = filters.searchTerm.toLowerCase();
      const matchesSearch =
        prop.name.toLowerCase().includes(term) ||
        prop.location.toLowerCase().includes(term) ||
        prop.city.toLowerCase().includes(term) ||
        prop.address.toLowerCase().includes(term) ||
        prop.nearestColleges.some((c) => c.name.toLowerCase().includes(term));

      if (!matchesSearch) return false;
    }

    // 2. City match
    if (filters.city && filters.city !== 'All') {
      if (prop.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
    }

    // 3. Gender preference match
    if (filters.gender && filters.gender !== 'All') {
      if (prop.gender.toLowerCase() !== filters.gender.toLowerCase()) {
        return false;
      }
    }

    // 4. Room sharing type match
    if (filters.roomType && filters.roomType !== 'All') {
      if (!prop.roomTypes.includes(filters.roomType as any)) {
        return false;
      }
    }

    // 5. Budget range match (check base price or any available room type price)
    if (filters.minBudget > 0 && prop.price < filters.minBudget) {
      return false;
    }
    if (filters.maxBudget > 0 && prop.price > filters.maxBudget) {
      return false;
    }

    // 6. Amenities match (all selected amenities must be present in property)
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((reqAmenity) =>
        prop.amenities.some((a) => a.toLowerCase() === reqAmenity.toLowerCase())
      );
      if (!hasAllAmenities) return false;
    }

    // 7. College filter match
    if (filters.collegeFilter && filters.collegeFilter.trim() !== '') {
      const collegeLower = filters.collegeFilter.toLowerCase();
      const matchesCollege = prop.nearestColleges.some((c) =>
        c.name.toLowerCase().includes(collegeLower)
      );
      if (!matchesCollege) return false;
    }

    return true;
  });
}

/**
 * Sort properties based on order criteria
 */
export function sortProperties(
  properties: Property[],
  sortBy: FilterState['sortBy']
): Property[] {
  const cloned = [...properties];
  switch (sortBy) {
    case 'price-asc':
      return cloned.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return cloned.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return cloned.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'popular':
    default:
      return cloned.sort((a, b) => {
        const aScore = (a.featured ? 10 : 0) + a.rating * 2 + a.reviewCount * 0.1;
        const bScore = (b.featured ? 10 : 0) + b.rating * 2 + b.reviewCount * 0.1;
        return bScore - aScore;
      });
  }
}

/**
 * Currency formatter for Indian Rupee
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const formatPriceINR = formatCurrency;

/**
 * Registration form validation logic
 */
export function validateRegistration(formData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }

  // Indian phone number validation (10 digits)
  const phoneClean = formData.phone.replace(/[^0-9]/g, '');
  if (!formData.phone || phoneClean.length !== 10) {
    errors.phone = 'Phone number must be a valid 10-digit number';
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (formData.confirmPassword !== undefined && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validation for adding or editing property in Admin panel
 */
export function validatePropertyForm(data: Partial<Property>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Property name is required (min 3 characters)';
  }
  if (!data.city || data.city.trim() === '') {
    errors.city = 'City is required';
  }
  if (!data.location || data.location.trim() === '') {
    errors.location = 'Locality/Area is required';
  }
  if (!data.price || data.price <= 0) {
    errors.price = 'Please enter a valid monthly rent amount';
  }
  if (!data.gender) {
    errors.gender = 'Gender type is required';
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description should be at least 10 characters';
  }
  if (!data.image || !data.image.startsWith('http')) {
    errors.image = 'A valid image URL is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculate distance in kilometers between two GPS coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate geographical center for a list of properties with coordinates
 */
export function getMapCenter(properties: Property[]): { lat: number; lng: number } {
  const validProps = properties.filter((p) => p.coordinates?.lat && p.coordinates?.lng);
  if (validProps.length === 0) {
    return { lat: 21.1458, lng: 79.0882 }; // Nagpur Central default
  }

  const sumLat = validProps.reduce((sum, p) => sum + (p.coordinates?.lat || 0), 0);
  const sumLng = validProps.reduce((sum, p) => sum + (p.coordinates?.lng || 0), 0);

  return {
    lat: Number((sumLat / validProps.length).toFixed(4)),
    lng: Number((sumLng / validProps.length).toFixed(4)),
  };
}

/**
 * Filter properties within a given radius (km) of a college campus
 */
export function filterPropertiesByCampusRadius(
  properties: Property[],
  campusLat: number,
  campusLng: number,
  maxRadiusKm: number
): Property[] {
  return properties.filter((prop) => {
    if (!prop.coordinates) return true;
    const dist = calculateDistance(campusLat, campusLng, prop.coordinates.lat, prop.coordinates.lng);
    return dist <= maxRadiusKm;
  });
}

