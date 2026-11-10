import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Star,
  Heart,
  Users,
  ShieldCheck,
  Check,
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  GraduationCap,
  Sparkles,
  Info,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Property, PropertyReview, User } from '../types';
import { formatCurrency } from '../utils/accommodationLogic';
import { AccommodationService } from '../services/api';

interface PropertyDetailModalProps {
  property: Property | null;
  currentUser: User | null;
  isShortlisted: boolean;
  onToggleShortlist: (id: number) => void;
  onClose: () => void;
  onOpenScheduleVisit: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  currentUser,
  isShortlisted,
  onToggleShortlist,
  onClose,
  onOpenScheduleVisit,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    if (property) {
      setSelectedImage(property.image);
      AccommodationService.getReviewsForProperty(property.id).then(setReviews);
    }
  }, [property]);

  if (!property) return null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    const added = await AccommodationService.addReview({
      propertyId: property.id,
      userName: currentUser ? currentUser.name : 'Student Resident',
      userCollege: currentUser?.college || 'College Student',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
    });

    setReviews([added, ...reviews]);
    setNewReviewComment('');
    setIsSubmittingReview(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md shadow-lg transition-transform hover:scale-105"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Section */}
        <div className="relative bg-slate-950 p-4 sm:p-6">
          <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
            <img
              src={selectedImage || property.image}
              alt={property.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {/* Top Tag Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-1">
                <Users className="w-3.5 h-3.5" />
                <span>{property.gender} Accommodation</span>
              </span>
              {property.verified && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Physically Verified</span>
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          {property.gallery && property.gallery.length > 0 && (
            <div className="mt-3 flex items-center space-x-2 overflow-x-auto pb-1">
              {[property.image, ...property.gallery].slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === img
                      ? 'border-purple-500 scale-105 ring-2 ring-purple-500/50'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          {/* Header Title & Pricing Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-slate-500 text-xs sm:text-sm font-medium mb-1">
                <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>{property.address}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
                {property.name}
              </h2>

              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>{property.rating} / 5.0</span>
                  <span className="text-slate-400 font-normal">({property.reviewCount} verified reviews)</span>
                </div>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  Available from {property.availableFrom || 'Immediate'}
                </span>
              </div>
            </div>

            {/* Pricing Box & Quick Actions */}
            <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase">Monthly Starting Rent</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-purple-900 font-['Outfit']">
                    {formatCurrency(property.price)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Security Deposit: {formatCurrency(property.deposit)} (Refundable)
                </p>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onToggleShortlist(property.id)}
                  className={`p-3 rounded-xl border transition-all ${
                    isShortlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-rose-500'
                  }`}
                  title={isShortlisted ? 'In your shortlist' : 'Add to shortlist'}
                >
                  <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-purple-600 transition-colors"
                  title="Share property link"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenScheduleVisit(property)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-purple-600/30 transition-all flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>I'm Interested / Visit</span>
                </button>
              </div>
            </div>
          </div>

          {copyFeedback && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 text-center animate-pulse">
              Link copied to clipboard!
            </div>
          )}

          {/* Room Sharing Configurations */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Available Room Sharing Options</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {property.sharingOptions.map((opt, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">{opt.type} Room</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {opt.available} Beds Left
                    </span>
                  </div>
                  <p className="text-xl font-black text-purple-700 font-['Outfit']">
                    {formatCurrency(opt.price)}
                    <span className="text-xs font-normal text-slate-500"> /mo</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Deposit: {formatCurrency(opt.deposit)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Proximity to Prominent Colleges */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Campus Proximity & Commute Times</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {property.nearestColleges.map((college, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <p className="font-bold text-slate-900">{college.name}</p>
                  <div className="flex items-center justify-between mt-1 text-slate-500">
                    <span>{college.distance} away</span>
                    <span className="font-semibold text-purple-600">{college.travelTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
              About this Student Accommodation
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 font-['Outfit'] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>All Amenities Included</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {property.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules & Policies */}
          <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center space-x-2">
              <Info className="w-4 h-4 text-amber-600" />
              <span>House Rules & Policies</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-950">
              {property.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Owner / Warden Contact info */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-900 text-white">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                {property.contactOwner[0]}
              </div>
              <div>
                <p className="text-xs text-slate-400">Hostel Warden / Owner</p>
                <p className="text-sm font-bold text-white">{property.contactOwner}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={`tel:${property.contactPhone}`}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors flex items-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Warden ({property.contactPhone})</span>
              </a>
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Outfit'] flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span>Student Reviews & Experiences ({reviews.length})</span>
            </h3>

            {/* Existing Reviews */}
            <div className="space-y-3 mb-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{rev.userName}</p>
                      <p className="text-[11px] text-slate-500">{rev.userCollege}</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs font-bold text-amber-700">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-2">Write a Student Review</h4>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs text-slate-500">Your Rating:</span>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  aria-label="Your Rating"
                  className="bg-white border border-slate-200 text-xs rounded-lg px-2 py-1 font-bold text-amber-700"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Needs Improvement</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <textarea
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Share your stay experience, food taste, Wi-Fi speed, and hostel environment..."
                rows={2}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
              />

              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReview || !newReviewComment.trim()}
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
