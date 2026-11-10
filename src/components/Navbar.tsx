import React, { useState } from 'react';
import {
  GraduationCap,
  Heart,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Database,
  Menu,
  X,
  Compass,
  Home as HomeIcon,
  Building2,
  FileCode,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  shortlistCount: number;
  activeView: 'home' | 'explore' | 'student-dashboard' | 'admin-dashboard';
  onNavigate: (view: 'home' | 'explore' | 'student-dashboard' | 'admin-dashboard') => void;
  onOpenAuth: () => void;
  onOpenProjectDocs: () => void;
  onLogout: () => void;
  onSwitchRole?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  shortlistCount,
  activeView,
  onNavigate,
  onOpenAuth,
  onOpenProjectDocs,
  onLogout,
  onSwitchRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">
                  Stay<span className="text-purple-400">Mate</span>
                </span>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-500/30 uppercase tracking-wider">
                  Student PG
                </span>
              </div>
              <p className="text-xs text-slate-400 -mt-0.5 hidden sm:block">
                College Accommodation Finder
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeView === 'home'
                  ? 'text-white bg-slate-800/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <HomeIcon className="w-4 h-4 text-purple-400" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('explore')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeView === 'explore'
                  ? 'text-white bg-slate-800/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Explore PGs</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  activeView === 'admin-dashboard'
                    ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40'
                    : 'text-amber-300 hover:text-white hover:bg-amber-500/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* Academic PHP & MySQL Export Button */}
            <button
              onClick={onOpenProjectDocs}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center space-x-1.5"
              title="View MySQL Database schema and PHP Backend APIs"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>PHP & MySQL DB</span>
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                SQL
              </span>
            </button>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-3">
            {/* Shortlist Counter Button */}
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="relative p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-200 hover:text-purple-300 transition-colors border border-slate-700/60"
              aria-label="View Shortlist"
              title="My Shortlist"
            >
              <Heart className="w-5 h-5 text-rose-400 fill-rose-500/20" />
              {shortlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {shortlistCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Login */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {onSwitchRole && (
                  <button
                    onClick={onSwitchRole}
                    className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    title="Quick demo switch between Student and Admin"
                  >
                    <span>Role:</span>
                    <span
                      className={
                        currentUser.role === 'admin' ? 'text-amber-400' : 'text-purple-400'
                      }
                    >
                      {currentUser.role === 'admin' ? 'Admin ⚙️' : 'Student 🎓'}
                    </span>
                  </button>
                )}
                <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 transition-all"
                  aria-expanded={userDropdownOpen}
                >
                  <img
                    src={
                      currentUser.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        currentUser.name
                      )}`
                    }
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-purple-500/40"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-white leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </p>
                    <span
                      className={`text-[10px] font-medium px-1 rounded uppercase ${
                        currentUser.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 divide-y divide-slate-800"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-purple-400 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigate('student-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-purple-900/30 hover:text-white flex items-center space-x-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        <span>Student Dashboard</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            onNavigate('admin-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-amber-300 hover:bg-amber-500/10 flex items-center space-x-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>Admin Control Panel</span>
                        </button>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-950/40 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-purple-600/25 transition-all flex items-center space-x-1.5"
              >
                <UserIcon className="w-4 h-4" />
                <span>Student Login</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-medium flex items-center space-x-2"
          >
            <HomeIcon className="w-4 h-4 text-purple-400" />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              onNavigate('explore');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-medium flex items-center space-x-2"
          >
            <Compass className="w-4 h-4 text-purple-400" />
            <span>Explore PGs & Hostels</span>
          </button>
          <button
            onClick={() => {
              onNavigate('student-dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-medium flex items-center space-x-2"
          >
            <LayoutDashboard className="w-4 h-4 text-purple-400" />
            <span>Student Dashboard & Shortlist ({shortlistCount})</span>
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                onNavigate('admin-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-amber-300 bg-amber-500/10 text-sm font-medium flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Dashboard</span>
            </button>
          )}
          <button
            onClick={() => {
              onOpenProjectDocs();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-amber-300 bg-amber-500/10 text-sm font-medium flex items-center space-x-2"
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>MySQL Schema & PHP Backend Code</span>
          </button>
        </div>
      )}
    </header>
  );
};
