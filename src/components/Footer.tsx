import React from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Heart,
  ExternalLink,
  Database,
} from 'lucide-react';

interface FooterProps {
  onOpenProjectDocs: () => void;
  onSelectLocality: (locality: string) => void;
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenProjectDocs,
  onSelectLocality,
  onOpenAuth,
}) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      {/* Student Helpline Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 py-4 px-4 sm:px-6 lg:px-8 border-b border-purple-800/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-purple-200 gap-3">
          <div className="flex items-center space-x-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              StayMate Student Safety & Verification Helpline (Nagpur):{' '}
              <strong className="text-white">1800-STAYMATE</strong> (24x7 Support)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenProjectDocs}
              className="text-amber-300 hover:text-amber-200 underline font-semibold flex items-center space-x-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Inspect MySQL Schema & PHP API Source</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">
                Stay<span className="text-purple-400">Mate</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              StayMate is a dedicated student accommodation discovery platform helping college
              students find affordable, verified PG rooms, hostels, and shared housing with zero
              brokerage and parent-approved safety.
            </p>
            <div className="text-xs text-slate-400 space-y-1 pt-2">
              <p className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Central Operations: Ramdaspeth / Civil Lines, Nagpur, MH 440010</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>support@staymate.in • helpline@staymate.in</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                <span>+91 98223 34455 / +91 98901 12233</span>
              </p>
            </div>
          </div>

          {/* Nagpur Campus Hubs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-['Outfit']">
              Campus Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {['Ramdaspeth (VNIT)', 'Dharampeth (LAD)', 'Sadar (RCOEM)', 'Hingna Road (YCCE)', 'Bajaj Nagar', 'Pratap Nagar'].map(
                (area) => (
                  <li key={area}>
                    <button
                      onClick={() => onSelectLocality(area.split(' ')[0])}
                      className="hover:text-purple-300 transition-colors"
                    >
                      {area}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Student Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-['Outfit']">
              Student Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#property-section" className="hover:text-purple-300">
                  Boys PGs & Hostels
                </a>
              </li>
              <li>
                <a href="#property-section" className="hover:text-purple-300">
                  Girls PGs & Residencies
                </a>
              </li>
              <li>
                <a href="#property-section" className="hover:text-purple-300">
                  Co-Living Spaces
                </a>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-purple-300">
                  Student Registration
                </button>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-purple-300">
                  Property Owner Portal
                </button>
              </li>
              <li>
                <span className="text-slate-500">Hostel Rent Agreements Guide</span>
              </li>
            </ul>
          </div>

          {/* Project & Architecture */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-['Outfit']">
              Academic Project Info
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenProjectDocs}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  MySQL Schema (5 Tables)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenProjectDocs}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  PHP RESTful API Source
                </button>
              </li>
              <li>
                <span className="text-slate-400">Normalized 3NF Architecture</span>
              </li>
              <li>
                <span className="text-slate-400">password_hash() BCRYPT</span>
              </li>
              <li>
                <span className="text-slate-400">Zero Brokerage Model</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 StayMate Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Built for College Students in Nagpur, Maharashtra</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline mx-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
