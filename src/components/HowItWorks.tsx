import React from 'react';
import { Search, HeartHandshake, CalendarCheck2, KeyRound } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <Search className="w-6 h-6 text-purple-600" />,
      title: 'Search & Filter',
      desc: 'Set your budget, room sharing type, and preferred campus in Nagpur to see matching student PGs.',
    },
    {
      step: '02',
      icon: <HeartHandshake className="w-6 h-6 text-indigo-600" />,
      title: 'Compare & Shortlist',
      desc: 'Inspect high-res room galleries, check food menus, read peer reviews, and save your favourites.',
    },
    {
      step: '03',
      icon: <CalendarCheck2 className="w-6 h-6 text-purple-600" />,
      title: 'Schedule a Free Visit',
      desc: 'Choose your preferred date and time slot to physically tour the accommodation with your parents.',
    },
    {
      step: '04',
      icon: <KeyRound className="w-6 h-6 text-emerald-600" />,
      title: 'Move In with Zero Fees',
      desc: 'Connect directly with the hostel warden. No broker commissions, clear deposit terms, and move-in support.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Four Simple Steps
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-['Outfit']">
            How StayMate Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            From search to move-in, find your college accommodation in under 10 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all"
            >
              <span className="absolute top-4 right-5 text-4xl font-black text-slate-100 font-['Outfit'] select-none">
                {st.step}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-5">
                {st.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">{st.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
