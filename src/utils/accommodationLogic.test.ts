import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProperties,
  sortProperties,
  validateRegistration,
  validatePropertyForm,
  calculateDistance,
  getMapCenter,
  filterPropertiesByCampusRadius,
} from './accommodationLogic';
import { Property, FilterState } from '../types';

const sampleProperties: Property[] = [
  {
    id: 1,
    name: 'Shree Ram Luxury Boys PG',
    city: 'Nagpur',
    location: 'Ramdaspeth',
    address: 'Plot 42, Central Bazar Rd, Ramdaspeth, Nagpur',
    price: 6500,
    deposit: 6500,
    gender: 'Boys',
    rating: 4.8,
    reviewCount: 32,
    description: 'Premier PG near VNIT with Wi-Fi and 3-time meals.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
    gallery: [],
    roomTypes: ['Single', 'Double', 'Triple'],
    sharingOptions: [
      { type: 'Single', price: 9500, available: 2, deposit: 9500 },
      { type: 'Double', price: 6500, available: 4, deposit: 6500 },
      { type: 'Triple', price: 5000, available: 6, deposit: 5000 },
    ],
    amenities: ['WiFi', 'Food Included', 'AC', 'Laundry', 'Biometric Security'],
    facilities: ['Geyser', 'Water Purifier', 'CCTV'],
    rules: ['Curfew 10:30 PM'],
    nearestColleges: [{ name: 'VNIT Nagpur', distance: '0.8 km', travelTime: '10 min walk' }],
    contactOwner: 'Rajesh Sharma',
    contactPhone: '9822334455',
    verified: true,
    featured: true,
  },
  {
    id: 2,
    name: 'Saraswati Girls Executive Hostel',
    city: 'Nagpur',
    location: 'Dharampeth',
    address: 'Near Coffee House, West High Court Rd, Dharampeth',
    price: 7500,
    deposit: 7500,
    gender: 'Girls',
    rating: 4.9,
    reviewCount: 45,
    description: 'Safe and secure girls hostel with 24/7 security guard.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
    gallery: [],
    roomTypes: ['Single', 'Double'],
    sharingOptions: [
      { type: 'Single', price: 11000, available: 1, deposit: 11000 },
      { type: 'Double', price: 7500, available: 3, deposit: 7500 },
    ],
    amenities: ['WiFi', 'Food Included', 'CCTV Security', 'Power Backup'],
    facilities: ['Microwave', 'Fridge', 'Study Table'],
    rules: ['Curfew 9:30 PM', 'No outside male guests'],
    nearestColleges: [{ name: 'LAD College', distance: '0.5 km', travelTime: '6 min walk' }],
    contactOwner: 'Sunita Patil',
    contactPhone: '9890112233',
    verified: true,
    featured: true,
  },
  {
    id: 3,
    name: 'CampusNest Co-Living',
    city: 'Pune',
    location: 'Viman Nagar',
    address: 'Symbiosis Campus Road, Pune',
    price: 12000,
    deposit: 12000,
    gender: 'Co-living',
    rating: 4.6,
    reviewCount: 18,
    description: 'Modern co-living space with cafeteria, gaming zone.',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf',
    gallery: [],
    roomTypes: ['Single', 'Double'],
    sharingOptions: [
      { type: 'Single', price: 15000, available: 2, deposit: 15000 },
      { type: 'Double', price: 12000, available: 4, deposit: 12000 },
    ],
    amenities: ['WiFi', 'AC', 'Gym', 'Laundry'],
    facilities: ['Smart TV', 'Lounge'],
    rules: ['No loud music after midnight'],
    nearestColleges: [{ name: 'Symbiosis College', distance: '0.6 km', travelTime: '8 min walk' }],
    contactOwner: 'Kunal Deshmukh',
    contactPhone: '9765432100',
    verified: true,
    featured: false,
  },
];

const defaultFilters: FilterState = {
  searchTerm: '',
  city: 'All',
  gender: 'All',
  roomType: 'All',
  minBudget: 0,
  maxBudget: 25000,
  amenities: [],
  sortBy: 'price-asc',
};

test('filterProperties filters by city accurately', () => {
  const result = filterProperties(sampleProperties, {
    ...defaultFilters,
    city: 'Nagpur',
  });
  assert.equal(result.length, 2);
  assert.equal(result.every((p) => p.city === 'Nagpur'), true);
});

test('filterProperties filters by gender type', () => {
  const girlsOnly = filterProperties(sampleProperties, {
    ...defaultFilters,
    gender: 'Girls',
  });
  assert.equal(girlsOnly.length, 1);
  assert.equal(girlsOnly[0].name, 'Saraswati Girls Executive Hostel');
});

test('filterProperties filters by budget range', () => {
  const budgetFiltered = filterProperties(sampleProperties, {
    ...defaultFilters,
    minBudget: 7000,
    maxBudget: 10000,
  });
  assert.equal(budgetFiltered.length, 1);
  assert.equal(budgetFiltered[0].id, 2);
});

test('filterProperties filters by required amenities', () => {
  const withGym = filterProperties(sampleProperties, {
    ...defaultFilters,
    amenities: ['Gym'],
  });
  assert.equal(withGym.length, 1);
  assert.equal(withGym[0].id, 3);
});

test('sortProperties orders by price ascending and descending', () => {
  const asc = sortProperties(sampleProperties, 'price-asc');
  assert.equal(asc[0].price, 6500);
  assert.equal(asc[2].price, 12000);

  const desc = sortProperties(sampleProperties, 'price-desc');
  assert.equal(desc[0].price, 12000);
  assert.equal(desc[2].price, 6500);
});

test('validateRegistration checks name, email, phone and password rules', () => {
  const invalid = validateRegistration({
    name: 'A',
    email: 'not-an-email',
    phone: '123',
    password: '123',
    confirmPassword: '456',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.password);
  assert.ok(invalid.errors.confirmPassword);

  const valid = validateRegistration({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@vnit.ac.in',
    phone: '9822114455',
    password: 'securePassword123',
    confirmPassword: 'securePassword123',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('validatePropertyForm checks required property fields', () => {
  const invalid = validatePropertyForm({});
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.city);
  assert.ok(invalid.errors.price);

  const valid = validatePropertyForm({
    name: 'Nagpur Elite PG',
    city: 'Nagpur',
    location: 'Sadar',
    price: 6000,
    gender: 'Boys',
    description: 'Clean rooms with high speed internet near college campus.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
  });
  assert.equal(valid.valid, true);
});

test('calculateDistance correctly calculates distance in km between coordinates', () => {
  // VNIT Nagpur (21.1254, 79.0515) to Ramdaspeth PG (21.1352, 79.0684)
  const dist = calculateDistance(21.1254, 79.0515, 21.1352, 79.0684);
  assert.ok(dist > 1.5 && dist < 2.5);

  // Same point should be 0
  assert.equal(calculateDistance(21.1254, 79.0515, 21.1254, 79.0515), 0);
});

test('getMapCenter calculates geographic midpoint of properties', () => {
  const propsWithCoords: Property[] = [
    { ...sampleProperties[0], coordinates: { lat: 21.1352, lng: 79.0684 } },
    { ...sampleProperties[1], coordinates: { lat: 21.1432, lng: 79.0620 } },
  ];
  const center = getMapCenter(propsWithCoords);
  assert.ok(center.lat > 21.13 && center.lat < 21.15);
  assert.ok(center.lng > 79.06 && center.lng < 79.07);

  // Fallback if no properties have coordinates
  const fallbackCenter = getMapCenter([]);
  assert.equal(fallbackCenter.lat, 21.1458);
  assert.equal(fallbackCenter.lng, 79.0882);
});

test('filterPropertiesByCampusRadius filters properties within radius', () => {
  const propsWithCoords: Property[] = [
    { ...sampleProperties[0], coordinates: { lat: 21.1352, lng: 79.0684 } }, // ~2 km from VNIT
    { ...sampleProperties[1], coordinates: { lat: 21.1432, lng: 79.0620 } }, // ~2.5 km from VNIT
    { ...sampleProperties[2], coordinates: { lat: 21.2500, lng: 79.2000 } }, // ~20 km away
  ];

  // Radius of 5 km should include first two
  const within5km = filterPropertiesByCampusRadius(propsWithCoords, 21.1254, 79.0515, 5);
  assert.equal(within5km.length, 2);

  // Radius of 1 km should exclude far ones
  const within1km = filterPropertiesByCampusRadius(propsWithCoords, 21.1254, 79.0515, 1);
  assert.equal(within1km.length, 0);
});

