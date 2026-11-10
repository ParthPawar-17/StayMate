import React from 'react';
import { X, Check, Minus, Star, MapPin, IndianRupee, Users, GraduationCap, Calendar, Trash2 } from 'lucide-react';
import { Property } from '../types';
import { formatCurrency } from '../utils/accommodationLogic';

interface CompareModalProps {
  properties: Property[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveFromShortlist: (id: number) => void;
  onOpenScheduleVisit: (property: Property) => void;
}

const COMPARISON_AMENITIES = [
  'High-speed WiFi',
  'Food Included (3 Meals)',
  'Air Conditioner (AC)',
  'Laundry Service & Washing Machine',
  '24/7 Power Backup',
  'CCTV & Biometric Security',
  'Attached Washroom',
  'Study Desk & Bookshelf',
  'Two-Wheeler Parking',
];

export const CompareModal: React.FC<CompareModalProps> = ({
  properties,
  isOpen,
  onClose,
  onRemoveFromShortlist,
  onOpenScheduleVisit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit']">
              Side-by-Side PG Comparison
            </h2>
            <p className="text-xs text-slate-400">
              Comparing {properties.length} shortlisted student accommodations in Nagpur
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {properties.length < 2 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500">
              Please shortlist at least 2 properties to compare them side by side.
            </p>
          </div>
        ) : (
          <div className="p-6 max-h-[75vh] overflow-auto">
            <div className="min-w-[700px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-left text-xs font-bold text-slate-400 uppercase w-48 bg-slate-50 rounded-tl-2xl">
                      Feature
                    </th>
                    {properties.map((p) => (
                      <th
                        key={p.id}
                        className="p-3 text-left w-64 bg-slate-50/50 border-l border-slate-200"
                      >
                        <div className="relative">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-28 object-cover rounded-xl mb-2"
                          />
                          <button
                            onClick={() => onRemoveFromShortlist(p.id)}
                            className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full shadow hover:scale-105"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{p.name}</h4>
                        <p className="text-[11px] text-slate-500">{p.location}, {p.city}</p>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* Monthly Rent */}
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50">Starting Rent</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 border-l border-slate-100">
                        <span className="text-base font-extrabold text-purple-700 font-['Outfit']">
                          {formatCurrency(p.price)}
                        </span>
                        <span className="text-[10px] text-slate-500"> /mo</span>
                      </td>
                    ))}
                  </tr>

                  {/* Security Deposit */}
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50">Security Deposit</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 border-l border-slate-100 text-slate-700 font-medium">
                        {formatCurrency(p.deposit)} (Refundable)
                      </td>
                    ))}
                  </tr>

                  {/* Gender */}
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50">Gender Preference</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 border-l border-slate-100">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-100 text-purple-800">
                          {p.gender} PG
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50">Student Rating</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 border-l border-slate-100">
                        <div className="flex items-center space-x-1 text-amber-700 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{p.rating} / 5.0</span>
                          <span className="text-[10px] text-slate-400">({p.reviewCount})</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Nearest College */}
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50">Nearest Campus</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 border-l border-slate-100 text-slate-700">
                        <p className="font-bold">{p.nearestColleges[0]?.name}</p>
                        <p className="text-[11px] text-purple-600 font-semibold">
                          {p.nearestColleges[0]?.distance} ({p.nearestColleges[0]?.travelTime})
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Room Options */}
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50">Available Rooms</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 border-l border-slate-100 text-slate-700">
                        <div className="space-y-1">
                          {p.sharingOptions.map((opt, i) => (
                            <div key={i} className="flex justify-between text-[11px]">
                              <span>{opt.type}:</span>
                              <span className="font-bold">{formatCurrency(opt.price)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Amenities Checklist Comparison */}
                  {COMPARISON_AMENITIES.map((amenity) => (
                    <tr key={amenity}>
                      <td className="p-3 font-medium text-slate-600 bg-slate-50">{amenity}</td>
                      {properties.map((p) => {
                        const hasAmenity = p.amenities.some(
                          (a) => a.toLowerCase() === amenity.toLowerCase()
                        );
                        return (
                          <td key={p.id} className="p-3 border-l border-slate-100">
                            {hasAmenity ? (
                              <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold text-xs">
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span>Included</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-slate-400 text-xs">
                                <Minus className="w-4 h-4" />
                                <span>Not listed</span>
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Action Row */}
                  <tr>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50 rounded-bl-2xl">
                      Action
                    </td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 border-l border-slate-100">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenScheduleVisit(p);
                          }}
                          className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Visit</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
