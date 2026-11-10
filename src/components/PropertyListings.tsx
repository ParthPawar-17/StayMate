import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  Map,
  RotateCcw,
  Search,
  MapPin,
  Filter,
  X,
  Heart,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { Property, FilterState, GenderType, RoomSharingType } from '../types';
import { PropertyCard } from './PropertyCard';
import { MockLeafletMap } from './MockLeafletMap';
import { formatCurrency } from '../utils/accommodationLogic';

interface PropertyListingsProps {
  properties: Property[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  shortlist: number[];
  onToggleShortlist: (id: number) => void;
  onViewDetails: (property: Property) => void;
  onInterestedClick: (property: Property) => void;
  onOpenCompare: () => void;
  isLoading?: boolean;
}

const AVAILABLE_AMENITIES = [
  'High-speed WiFi',
  'Food Included (3 Meals)',
  'Air Conditioner (AC)',
  'Laundry Service & Washing Machine',
  '24/7 Power Backup',
  'CCTV & Biometric Security',
  'Attached Washroom',
  'Daily Room Cleaning',
  'Study Desk & Bookshelf',
  'RO Purified Drinking Water',
  'Gym / Fitness Corner',
  'Two-Wheeler Parking',
];

export const PropertyListings: React.FC<PropertyListingsProps> = ({
  properties,
  filters,
  onFilterChange,
  shortlist,
  onToggleShortlist,
  onViewDetails,
  onInterestedClick,
  onOpenCompare,
  isLoading = false,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFilterDrawer, setMobileFilterDrawer] = useState(false);

  const handleGenderChange = (val: string) => {
    onFilterChange({ ...filters, gender: val });
  };

  const handleRoomTypeChange = (val: string) => {
    onFilterChange({ ...filters, roomType: val });
  };

  const handleAmenityToggle = (amenityName: string) => {
    const exists = filters.amenities.includes(amenityName);
    const updated = exists
      ? filters.amenities.filter((a) => a !== amenityName)
      : [...filters.amenities, amenityName];
    onFilterChange({ ...filters, amenities: updated });
  };

  const handleResetFilters = () => {
    onFilterChange({
      searchTerm: '',
      city: 'All',
      gender: 'All',
      roomType: 'All',
      minBudget: 0,
      maxBudget: 25000,
      amenities: [],
      sortBy: 'popular',
      collegeFilter: '',
    });
  };

  return (
    <div id="property-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Student Accommodations & PGs
            </h2>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              {properties.length} Available
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time verified listings in Nagpur and top campus zones with zero brokerage.
          </p>
        </div>

        {/* View Switcher, Sort and Mobile Filter Button */}
        <div className="flex items-center space-x-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterDrawer(true)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-bold text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({filters.amenities.length + (filters.gender !== 'All' ? 1 : 0)})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
              }
              aria-label="Sort accommodations"
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: Highest First</option>
            </select>
          </div>

          {/* View on Map Toggle Button */}
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'grid' : 'map')}
            className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs ${
              viewMode === 'map'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:text-purple-700'
            }`}
            aria-label="Toggle View on Map"
          >
            <Map className="w-3.5 h-3.5 text-purple-500" />
            <span>{viewMode === 'map' ? 'Show Grid/List' : 'View on Map'}</span>
          </button>

          {/* Grid / List / Map Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-purple-700 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-purple-700 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'map'
                  ? 'bg-white text-purple-700 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Map View"
              aria-label="Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Filter Sidebar + Right Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Filter Options</h3>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center space-x-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Search Locality or College
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
                  placeholder="e.g. Ramdaspeth, VNIT"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">City</label>
              <select
                value={filters.city}
                onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-purple-500"
              >
                <option value="All">All Cities</option>
                <option value="Nagpur">Nagpur, Maharashtra</option>
                <option value="Pune">Pune, Maharashtra</option>
                <option value="Mumbai">Mumbai, Maharashtra</option>
              </select>
            </div>

            {/* Gender Type */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Gender Preference</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['All', 'Boys', 'Girls', 'Co-living'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGenderChange(g)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      filters.gender === g
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g === 'All' ? 'Any Gender' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Sharing Type */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Room Type</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['All', 'Single', 'Double', 'Triple', '4-Sharing'].map((rt) => (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => handleRoomTypeChange(rt)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                      filters.roomType === rt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {rt === 'All' ? 'All Types' : rt}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Maximum Rent</span>
                <span className="text-purple-600 font-extrabold">
                  {formatCurrency(filters.maxBudget)}
                </span>
              </div>
              <input
                type="range"
                min={3000}
                max={20000}
                step={500}
                value={filters.maxBudget}
                onChange={(e) =>
                  onFilterChange({ ...filters, maxBudget: Number(e.target.value) })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹3,000</span>
                <span>₹10,000</span>
                <span>₹20,000+</span>
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-600 mb-2.5">
                Must-Have Amenities
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {AVAILABLE_AMENITIES.map((amenity) => {
                  const checked = filters.amenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-700 hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer accent-purple-600"
                      />
                      <span className={checked ? 'font-bold text-purple-900' : 'font-normal'}>
                        {amenity}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Property Grid or List View */}
        <main className="lg:col-span-3">
          {/* Active Filter Chips */}
          {(filters.searchTerm ||
            filters.city !== 'All' ||
            filters.gender !== 'All' ||
            filters.roomType !== 'All' ||
            filters.amenities.length > 0 ||
            filters.maxBudget < 20000) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Applied Filters:</span>

              {filters.city !== 'All' && (
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <span>City: {filters.city}</span>
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => onFilterChange({ ...filters, city: 'All' })}
                  />
                </span>
              )}

              {filters.gender !== 'All' && (
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <span>{filters.gender}</span>
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => onFilterChange({ ...filters, gender: 'All' })}
                  />
                </span>
              )}

              {filters.roomType !== 'All' && (
                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <span>Room: {filters.roomType}</span>
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => onFilterChange({ ...filters, roomType: 'All' })}
                  />
                </span>
              )}

              {filters.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center space-x-1"
                >
                  <span>{amenity}</span>
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleAmenityToggle(amenity)}
                  />
                </span>
              ))}

              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Properties List / Loading Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((sk) => (
                <div
                  key={sk}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 p-4 space-y-3 animate-pulse"
                >
                  <div className="h-48 bg-slate-200 rounded-xl w-full" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-5 bg-slate-100 rounded w-16" />
                    <div className="h-5 bg-slate-100 rounded w-16" />
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="h-6 bg-slate-200 rounded w-24" />
                    <div className="h-8 bg-slate-200 rounded-xl w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-6">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                No properties match your current filters
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                Try widening your budget, removing specific amenity filters, or selecting "All"
                gender categories.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start sm:items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-['Outfit']">
                      Nagpur Campus Map View ({properties.length} Properties Located)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Explore PGs with Leaflet map interface. Drag to pan, zoom, click price markers or campus pins to inspect walking times.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500">Switch view:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-purple-600 hover:border-purple-300 shadow-xs transition-colors"
                  >
                    Grid View
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-purple-600 hover:border-purple-300 shadow-xs transition-colors"
                  >
                    List View
                  </button>
                </div>
              </div>

              <MockLeafletMap
                properties={properties}
                shortlist={shortlist}
                onToggleShortlist={onToggleShortlist}
                onViewDetails={onViewDetails}
                onInterestedClick={onInterestedClick}
              />
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isShortlisted={shortlist.includes(property.id)}
                  onToggleShortlist={onToggleShortlist}
                  onViewDetails={onViewDetails}
                  onInterestedClick={onInterestedClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Shortlist Comparison Bar if 2+ saved */}
      {shortlist.length >= 2 && (
        <div className="fixed bottom-6 right-6 z-30 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-purple-500/40 flex items-center justify-between space-x-4 animate-bounce-subtle">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {shortlist.length} PGs in Your Shortlist
              </p>
              <p className="text-[11px] text-slate-400">Compare rents, amenities & locations</p>
            </div>
          </div>
          <button
            onClick={onOpenCompare}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md shadow-purple-600/30 whitespace-nowrap"
          >
            Compare PGs
          </button>
        </div>
      )}

      {/* Mobile Filters Drawer */}
      {mobileFilterDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <h3 className="font-bold text-base text-slate-900">Filters</h3>
              <button
                onClick={() => setMobileFilterDrawer(false)}
                className="p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Mobile filter controls replicate desktop */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                {['All', 'Boys', 'Girls', 'Co-living'].map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGenderChange(g)}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      filters.gender === g
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Max Monthly Rent: {formatCurrency(filters.maxBudget)}
              </label>
              <input
                type="range"
                min={3000}
                max={20000}
                step={500}
                value={filters.maxBudget}
                onChange={(e) =>
                  onFilterChange({ ...filters, maxBudget: Number(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => setMobileFilterDrawer(false)}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-md"
              >
                Show {properties.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
