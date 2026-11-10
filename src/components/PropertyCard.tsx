import React from 'react';
import {
  MapPin,
  Star,
  Heart,
  Users,
  ShieldCheck,
  Check,
  Wifi,
  Utensils,
  Wind,
  Shirt,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { Property } from '../types';
import { formatCurrency } from '../utils/accommodationLogic';

interface PropertyCardProps {
  property: Property;
  isShortlisted: boolean;
  onToggleShortlist: (id: number) => void;
  onViewDetails: (property: Property) => void;
  onInterestedClick: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isShortlisted,
  onToggleShortlist,
  onViewDetails,
  onInterestedClick,
}) => {
  // Gender badge styling
  const genderBadgeClass =
    property.gender === 'Boys'
      ? 'bg-blue-600/90 text-white'
      : property.gender === 'Girls'
      ? 'bg-rose-600/90 text-white'
      : 'bg-purple-600/90 text-white';

  // Find nearest college
  const nearestCollege = property.nearestColleges[0];

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col h-full relative">
      {/* Property Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

        {/* Gender Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide shadow-md backdrop-blur-md flex items-center space-x-1 ${genderBadgeClass}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{property.gender} PG</span>
          </span>

          {property.verified && (
            <span className="bg-emerald-600 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Shortlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleShortlist(property.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-transform active:scale-90 cursor-pointer ${
            isShortlisted
              ? 'bg-rose-500 text-white scale-110 shadow-rose-500/40'
              : 'bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white backdrop-blur-sm'
          }`}
          aria-label={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
          title={isShortlisted ? 'In your shortlist' : 'Save to shortlist'}
        >
          <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom image overlay info: Nearest College */}
        {nearestCollege && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center space-x-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              <span className="truncate max-w-[190px]">
                {nearestCollege.name} ({nearestCollege.distance})
              </span>
            </span>

            {/* Sharing types badges */}
            <span className="bg-purple-950/80 text-purple-200 border border-purple-400/30 text-[11px] px-2 py-0.5 rounded font-semibold">
              {property.roomTypes.join(' • ')}
            </span>
          </div>
        )}
      </div>

      {/* Property Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Location */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1 text-slate-500 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
              <span className="truncate">
                {property.location}, {property.city}
              </span>
            </div>

            <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-md text-xs font-bold">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{property.rating}</span>
              <span className="text-amber-600/70 font-normal">({property.reviewCount})</span>
            </div>
          </div>

          {/* Property Title */}
          <h3
            onClick={() => onViewDetails(property)}
            className="text-lg font-bold text-slate-900 hover:text-purple-600 transition-colors line-clamp-1 cursor-pointer font-['Outfit']"
            title={property.name}
          >
            {property.name}
          </h3>

          {/* Brief Description */}
          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {property.description}
          </p>

          {/* Key Amenities Pills */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {property.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center space-x-1"
              >
                <Check className="w-3 h-3 text-purple-600" />
                <span className="truncate max-w-[120px]">{amenity}</span>
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[11px] text-purple-600 font-semibold self-center">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Actions Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Monthly Rent from</div>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-extrabold text-slate-900 font-['Outfit']">
                {formatCurrency(property.price)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/month</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onInterestedClick(property)}
              className="px-2.5 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
              title="Schedule a visit or express interest"
            >
              Interested
            </button>
            <button
              type="button"
              onClick={() => onViewDetails(property)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-purple-700 transition-colors shadow-sm flex items-center space-x-1 cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
