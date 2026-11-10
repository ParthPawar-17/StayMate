import React, { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Calendar,
  Eye,
  Settings,
  LogOut,
  MapPin,
  Star,
  Trash2,
  ArrowRight,
  GraduationCap,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { User as UserType, Property, InterestedLead } from '../types';
import { AccommodationService } from '../services/api';
import { formatCurrency } from '../utils/accommodationLogic';

interface StudentDashboardProps {
  currentUser: UserType | null;
  properties: Property[];
  shortlistIds: number[];
  onToggleShortlist: (id: number) => void;
  onViewDetails: (property: Property) => void;
  onLogout: () => void;
  onOpenExplore: () => void;
  onOpenCompare: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  properties,
  shortlistIds,
  onToggleShortlist,
  onViewDetails,
  onLogout,
  onOpenExplore,
  onOpenCompare,
}) => {
  const [activeTab, setActiveTab] = useState<'shortlist' | 'visits' | 'recent' | 'profile'>(
    'shortlist'
  );
  const [interestedLeads, setInterestedLeads] = useState<InterestedLead[]>([]);
  const [recentPropertyIds, setRecentPropertyIds] = useState<number[]>([]);

  // Profile edit state
  const [studentPhone, setStudentPhone] = useState(currentUser?.phone || '');
  const [studentCollege, setStudentCollege] = useState(currentUser?.college || '');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      AccommodationService.getInterestedByUser(currentUser.id).then(setInterestedLeads);
      setRecentPropertyIds(AccommodationService.getRecentlyViewed());
    }
  }, [currentUser]);

  const shortlistedProps = properties.filter((p) => shortlistIds.includes(p.id));
  const recentProps = properties.filter((p) => recentPropertyIds.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      currentUser.phone = studentPhone;
      currentUser.college = studentCollege;
      AccommodationService.setCurrentUser({ ...currentUser });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
          Student Authentication Required
        </h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Please log in or sign up with your student email to view your shortlist, booked visits, and
          custom preferences.
        </p>
        <button
          onClick={onOpenExplore}
          className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-md hover:bg-purple-700"
        >
          Browse Accommodations
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner / Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={
                currentUser.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  currentUser.name
                )}`
              }
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-purple-500/30"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
                  Welcome back, {currentUser.name}!
                </h1>
                <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-0.5 rounded-full border border-purple-400/30">
                  Verified Student
                </span>
              </div>
              <p className="text-sm text-slate-300 flex items-center space-x-2 mt-1">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>{currentUser.college || 'College Student'}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{currentUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenExplore}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Explore More PGs
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 hover:text-rose-400 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Counters */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/40">
            <p className="text-xs text-slate-400 font-medium">Shortlisted PGs</p>
            <p className="text-2xl font-black text-white font-['Outfit'] mt-1">
              {shortlistIds.length}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/40">
            <p className="text-xs text-slate-400 font-medium">Scheduled Visits</p>
            <p className="text-2xl font-black text-purple-400 font-['Outfit'] mt-1">
              {interestedLeads.length}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/40">
            <p className="text-xs text-slate-400 font-medium">Recently Viewed</p>
            <p className="text-2xl font-black text-indigo-400 font-['Outfit'] mt-1">
              {recentProps.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('shortlist')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'shortlist'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>My Shortlist ({shortlistIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'visits'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Scheduled Visits ({interestedLeads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'recent'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Recently Viewed</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab 1: My Shortlist */}
      {activeTab === 'shortlist' && (
        <div>
          {shortlistedProps.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Your Shortlist is Empty
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Save PG rooms and hostels that you like to compare pricing, sharing types, and
                distance from your college.
              </p>
              <button
                onClick={onOpenExplore}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-700"
              >
                Browse Accommodations
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-slate-500">
                  Showing {shortlistedProps.length} saved student accommodations
                </p>
                {shortlistedProps.length >= 2 && (
                  <button
                    onClick={onOpenCompare}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-sm hover:bg-purple-700"
                  >
                    Compare Shortlisted PGs Side-by-Side
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shortlistedProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full">
                        <img
                          src={prop.image}
                          alt={prop.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => onToggleShortlist(prop.id)}
                          className="absolute top-3 right-3 p-2 bg-rose-500 text-white rounded-full shadow-md hover:scale-105"
                          title="Remove from shortlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                          {prop.gender} PG
                        </span>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-purple-600" />
                            <span>{prop.location}</span>
                          </span>
                          <span className="text-xs font-bold text-amber-700 flex items-center space-x-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{prop.rating}</span>
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {prop.name}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {prop.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">From</span>
                        <p className="text-base font-extrabold text-slate-900 font-['Outfit']">
                          {formatCurrency(prop.price)}
                          <span className="text-[10px] font-normal text-slate-500"> /mo</span>
                        </p>
                      </div>
                      <button
                        onClick={() => onViewDetails(prop)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Scheduled Visits */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          {interestedLeads.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                No Visits Scheduled Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                When you click "I'm Interested / Schedule Visit" on any accommodation, your scheduled
                time slot and status will appear here.
              </p>
              <button
                onClick={onOpenExplore}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md"
              >
                Find Accommodations to Visit
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
              {interestedLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={lead.propertyImage}
                      alt={lead.propertyName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-slate-900 font-['Outfit']">
                          {lead.propertyName}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            lead.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.status === 'Visit Scheduled'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
                        <span>{lead.propertyLocation}</span>
                        <span>•</span>
                        <span className="font-semibold text-purple-700">
                          {lead.sharingPreference}
                        </span>
                      </p>
                      <p className="text-xs text-slate-600 mt-1 flex items-center space-x-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>Visit Date: {lead.visitDate}</span>
                        <span>({lead.timeSlot})</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      Zero Brokerage Applied
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Recently Viewed */}
      {activeTab === 'recent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProps.map((prop) => (
            <div
              key={prop.id}
              onClick={() => onViewDetails(prop)}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center space-x-3"
            >
              <img
                src={prop.image}
                alt={prop.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{prop.name}</p>
                <p className="text-[11px] text-slate-500">{prop.location}</p>
                <p className="text-xs font-black text-purple-700 mt-0.5">
                  {formatCurrency(prop.price)} /mo
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Outfit']">
            Student Profile & Preferences
          </h3>

          {profileSaved && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={currentUser.name}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Student Email</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Mobile (10-digits)
              </label>
              <input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College / Institute Name
              </label>
              <input
                type="text"
                value={studentCollege}
                onChange={(e) => setStudentCollege(e.target.value)}
                placeholder="e.g. VNIT Nagpur, RCOEM, LAD College"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
