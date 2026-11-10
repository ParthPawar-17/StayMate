import {
  Property,
  Amenity,
  User,
  PropertyReview,
  InterestedLead,
  FilterState,
} from '../types';
import {
  INITIAL_PROPERTIES,
  SAMPLE_AMENITIES,
  SAMPLE_REVIEWS,
  DEMO_USERS,
  INITIAL_INTERESTED_LEADS,
} from '../data/mockData';
import { filterProperties, sortProperties, validateRegistration } from '../utils/accommodationLogic';

const STORAGE_KEYS = {
  PROPERTIES: 'staymate_properties_v1',
  USERS: 'staymate_users_v1',
  CURRENT_USER: 'staymate_current_user_v1',
  SHORTLIST: 'staymate_shortlist_v1',
  INTERESTED: 'staymate_interested_v1',
  REVIEWS: 'staymate_reviews_v1',
  RECENTLY_VIEWED: 'staymate_recent_v1',
};

// Helper to load or initialize from localStorage
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving to localStorage for ${key}`, e);
  }
}

// Service class implementing simulated AJAX + storage
export const AccommodationService = {
  // --- PROPERTIES ---
  async getProperties(filters?: FilterState): Promise<{ properties: Property[]; total: number }> {
    await new Promise((res) => setTimeout(res, 80)); // Realistic AJAX response delay
    const all = getStored<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);

    if (!filters) {
      return { properties: all, total: all.length };
    }

    const filtered = filterProperties(all, filters);
    const sorted = sortProperties(filtered, filters.sortBy);
    return { properties: sorted, total: sorted.length };
  },

  async getPropertyById(id: number): Promise<Property | null> {
    await new Promise((res) => setTimeout(res, 50));
    const all = getStored<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const found = all.find((p) => p.id === id) || null;

    if (found) {
      // Record in recently viewed
      AccommodationService.recordRecentlyViewed(id);
    }
    return found;
  },

  async addProperty(data: Omit<Property, 'id' | 'rating' | 'reviewCount'>): Promise<Property> {
    await new Promise((res) => setTimeout(res, 120));
    const all = getStored<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const newId = all.length > 0 ? Math.max(...all.map((p) => p.id)) + 1 : 1;

    const newProperty: Property = {
      ...data,
      id: newId,
      rating: 4.8,
      reviewCount: 0,
    };

    const updated = [newProperty, ...all];
    setStored(STORAGE_KEYS.PROPERTIES, updated);
    return newProperty;
  },

  async updateProperty(id: number, data: Partial<Property>): Promise<Property> {
    await new Promise((res) => setTimeout(res, 100));
    const all = getStored<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Property not found');

    const updatedProperty = { ...all[index], ...data };
    all[index] = updatedProperty;
    setStored(STORAGE_KEYS.PROPERTIES, all);
    return updatedProperty;
  },

  async deleteProperty(id: number): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 100));
    const all = getStored<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const filtered = all.filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PROPERTIES, filtered);
    return true;
  },

  // --- AMENITIES ---
  async getAmenities(): Promise<Amenity[]> {
    return SAMPLE_AMENITIES;
  },

  // --- SHORTLIST / FAVOURITES ---
  getShortlist(): number[] {
    return getStored<number[]>(STORAGE_KEYS.SHORTLIST, [1, 2]);
  },

  toggleShortlist(propertyId: number): { added: boolean; list: number[] } {
    const list = AccommodationService.getShortlist();
    const index = list.indexOf(propertyId);
    let updated: number[];
    let added = false;

    if (index > -1) {
      updated = list.filter((id) => id !== propertyId);
      added = false;
    } else {
      updated = [...list, propertyId];
      added = true;
    }

    setStored(STORAGE_KEYS.SHORTLIST, updated);
    return { added, list: updated };
  },

  isShortlisted(propertyId: number): boolean {
    const list = AccommodationService.getShortlist();
    return list.includes(propertyId);
  },

  // --- INTERESTED / VISITS ---
  async scheduleVisit(lead: {
    userId: number;
    userName: string;
    userEmail: string;
    userPhone: string;
    propertyId: number;
    visitDate: string;
    timeSlot: string;
    sharingPreference: string;
    notes?: string;
  }): Promise<InterestedLead> {
    await new Promise((res) => setTimeout(res, 150));
    const allLeads = getStored<InterestedLead[]>(STORAGE_KEYS.INTERESTED, INITIAL_INTERESTED_LEADS);
    const prop = await AccommodationService.getPropertyById(lead.propertyId);

    const newLead: InterestedLead = {
      id: Date.now(),
      userId: lead.userId,
      userName: lead.userName,
      userEmail: lead.userEmail,
      userPhone: lead.userPhone,
      propertyId: lead.propertyId,
      propertyName: prop?.name || 'Student PG Accommodation',
      propertyLocation: prop?.location || 'Nagpur',
      propertyPrice: prop?.price || 5000,
      propertyImage: prop?.image || '',
      visitDate: lead.visitDate,
      timeSlot: lead.timeSlot,
      sharingPreference: lead.sharingPreference,
      status: 'Visit Scheduled',
      notes: lead.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newLead, ...allLeads];
    setStored(STORAGE_KEYS.INTERESTED, updated);
    return newLead;
  },

  async getInterestedByUser(userId: number): Promise<InterestedLead[]> {
    const allLeads = getStored<InterestedLead[]>(STORAGE_KEYS.INTERESTED, INITIAL_INTERESTED_LEADS);
    return allLeads.filter((l) => l.userId === userId);
  },

  async getAllInterestedLeads(): Promise<InterestedLead[]> {
    return getStored<InterestedLead[]>(STORAGE_KEYS.INTERESTED, INITIAL_INTERESTED_LEADS);
  },

  async updateLeadStatus(id: number, status: InterestedLead['status']): Promise<void> {
    const allLeads = getStored<InterestedLead[]>(STORAGE_KEYS.INTERESTED, INITIAL_INTERESTED_LEADS);
    const index = allLeads.findIndex((l) => l.id === id);
    if (index !== -1) {
      allLeads[index].status = status;
      setStored(STORAGE_KEYS.INTERESTED, allLeads);
    }
  },

  // --- REVIEWS ---
  async getReviewsForProperty(propertyId: number): Promise<PropertyReview[]> {
    const all = getStored<PropertyReview[]>(STORAGE_KEYS.REVIEWS, SAMPLE_REVIEWS);
    return all.filter((r) => r.propertyId === propertyId);
  },

  async addReview(review: Omit<PropertyReview, 'id' | 'date'>): Promise<PropertyReview> {
    await new Promise((res) => setTimeout(res, 80));
    const all = getStored<PropertyReview[]>(STORAGE_KEYS.REVIEWS, SAMPLE_REVIEWS);
    const newReview: PropertyReview = {
      ...review,
      id: Date.now(),
      date: 'Just now',
    };
    const updated = [newReview, ...all];
    setStored(STORAGE_KEYS.REVIEWS, updated);
    return newReview;
  },

  // --- RECENTLY VIEWED ---
  recordRecentlyViewed(propertyId: number): void {
    const current = getStored<number[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
    const updated = [propertyId, ...current.filter((id) => id !== propertyId)].slice(0, 8);
    setStored(STORAGE_KEYS.RECENTLY_VIEWED, updated);
  },

  getRecentlyViewed(): number[] {
    return getStored<number[]>(STORAGE_KEYS.RECENTLY_VIEWED, [1, 2, 3]);
  },

  // --- AUTHENTICATION ---
  getCurrentUser(): User | null {
    return getStored<User | null>(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
  },

  setCurrentUser(user: User | null): void {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
  },

  async login(email: string, pass: string): Promise<User> {
    await new Promise((res) => setTimeout(res, 120));
    const users = getStored<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      throw new Error('No account found with this email address.');
    }
    // Demo password checks
    if (pass.length < 4) {
      throw new Error('Invalid password.');
    }

    AccommodationService.setCurrentUser(user);
    return user;
  },

  async register(formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    college?: string;
    role?: 'student' | 'admin';
  }): Promise<User> {
    await new Promise((res) => setTimeout(res, 150));
    const validation = validateRegistration(formData);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    const users = getStored<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
    if (users.some((u) => u.email.toLowerCase() === formData.email.toLowerCase())) {
      throw new Error('This email address is already registered. Please login.');
    }

    const newUser: User = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role || 'student',
      college: formData.college || 'College Student',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}`,
      created_at: new Date().toISOString().split('T')[0],
    };

    const updated = [...users, newUser];
    setStored(STORAGE_KEYS.USERS, updated);
    AccommodationService.setCurrentUser(newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    AccommodationService.setCurrentUser(null);
  },

  async resetToDemoData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.SHORTLIST);
    localStorage.removeItem(STORAGE_KEYS.INTERESTED);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
    setStored(STORAGE_KEYS.USERS, DEMO_USERS);
    setStored(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
  },
};
