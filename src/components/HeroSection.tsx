import React, { useState } from 'react';
import {
  Search,
  MapPin,
  IndianRupee,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { FilterState, GenderType } from '../types';

interface HeroSectionProps {
  onSearch: (filters: Partial<FilterState>) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExploreClick }) => {
  const [city, setCity] = useState('Nagpur');
  const [budgetRange, setBudgetRange] = useState('all');
  const [gender, setGender] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let minBudget = 0;
    let maxBudget = 25000;

    if (budgetRange === 'under-6000') {
      minBudget = 0;
      maxBudget = 6000;
    } else if (budgetRange === '6000-9000') {
      minBudget = 6000;
      maxBudget = 9000;
    } else if (budgetRange === '9000-plus') {
      minBudget = 9000;
      maxBudget = 25000;
    }

    onSearch({
      city,
      gender: gender as any,
      minBudget,
      maxBudget,
      searchTerm: searchKeyword,
    });
  };

  const handleQuickCampus = (campusName: string) => {
    onSearch({
      city: 'Nagpur',
      searchTerm: campusName,
    });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-48 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Student Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs sm:text-sm font-semibold tracking-wide shadow-inner backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Over 1,200+ Verified Student Beds in Nagpur & Maharashtra</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Student Home
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Discover affordable PGs, hostels, and shared accommodations near your college campus.
            Zero brokerage, verified facilities, hygienic meals, and student-friendly rules.
          </p>
        </div>

        {/* Real Estate Style Search Filter Card */}
        <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* City Selector */}
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 focus-within:border-purple-500 transition-colors">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>City</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="Nagpur" className="bg-slate-900 text-white">
                    Nagpur, MH
                  </option>
                  <option value="Pune" className="bg-slate-900 text-white">
                    Pune, MH
                  </option>
                  <option value="Mumbai" className="bg-slate-900 text-white">
                    Mumbai, MH
                  </option>
                  <option value="All" className="bg-slate-900 text-white">
                    All Locations
                  </option>
                </select>
              </div>

              {/* Budget Range */}
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 focus-within:border-purple-500 transition-colors">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <IndianRupee className="w-3.5 h-3.5 text-purple-400" />
                  <span>Monthly Budget</span>
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">
                    Any Budget
                  </option>
                  <option value="under-6000" className="bg-slate-900 text-white">
                    Under ₹6,000 / mo
                  </option>
                  <option value="6000-9000" className="bg-slate-900 text-white">
                    ₹6,000 – ₹9,000 / mo
                  </option>
                  <option value="9000-plus" className="bg-slate-900 text-white">
                    ₹9,000+ (Premium)
                  </option>
                </select>
              </div>

              {/* Accommodation Type / Gender */}
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 focus-within:border-purple-500 transition-colors">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Type / Gender</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-slate-900 text-white">
                    All (Boys, Girls, Co-living)
                  </option>
                  <option value="Boys" className="bg-slate-900 text-white">
                    Boys PG
                  </option>
                  <option value="Girls" className="bg-slate-900 text-white">
                    Girls PG
                  </option>
                  <option value="Co-living" className="bg-slate-900 text-white">
                    Co-living Spaces
                  </option>
                </select>
              </div>

              {/* Keyword / College input */}
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 focus-within:border-purple-500 transition-colors">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <Search className="w-3.5 h-3.5 text-purple-400" />
                  <span>College or Area</span>
                </label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="e.g. VNIT, Ramdaspeth"
                  className="w-full bg-transparent text-white placeholder-slate-500 font-semibold text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
              <div className="text-xs text-slate-400 flex items-center space-x-4">
                <span className="flex items-center space-x-1 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Brokerage</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Parent-Approved Safety</span>
                </span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quick College Filters */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center space-x-1 mr-1">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>Popular Nagpur Campuses:</span>
          </span>
          {['VNIT Nagpur', 'RCOEM', 'LAD Dharampeth', 'YCCE Hingna', 'GH Raisoni', 'KDK Engg'].map(
            (college) => (
              <button
                key={college}
                onClick={() => handleQuickCampus(college)}
                className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-purple-900/40 border border-slate-700/60 hover:border-purple-500/50 text-slate-300 hover:text-white transition-all cursor-pointer font-medium"
              >
                {college}
              </button>
            )
          )}
        </div>

        {/* Key Feature Stats Pills */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80 pt-10 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">100%</p>
            <p className="text-xs text-slate-400 mt-1">Physically Verified Rooms</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-purple-400 font-['Outfit']">₹0</p>
            <p className="text-xs text-slate-400 mt-1">Brokerage Fee Guarantee</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-400 font-['Outfit']">&lt; 15 min</p>
            <p className="text-xs text-slate-400 mt-1">Average Campus Commute</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">4.8 / 5</p>
            <p className="text-xs text-slate-400 mt-1">Student Satisfaction Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};
