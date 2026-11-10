import React from 'react';
import {
  ShieldCheck,
  IndianRupee,
  Utensils,
  Wifi,
  Clock,
  Sparkles,
  Award,
  Users2,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <IndianRupee className="w-6 h-6 text-purple-600" />,
      title: 'Zero Brokerage Guarantee',
      desc: 'Direct connection with verified PG owners and wardens. No hidden agent commissions or brokerage charges.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      title: '100% Physically Verified',
      desc: 'Our student ambassadors personally inspect every property for hygiene, biometric security, and clean drinking water.',
    },
    {
      icon: <Utensils className="w-6 h-6 text-amber-600" />,
      title: 'Hygienic Home-Style Meals',
      desc: 'Freshly prepared 3-time meals with rotating regional menus, unlimited breakfast, and strict kitchen hygiene standards.',
    },
    {
      icon: <Wifi className="w-6 h-6 text-blue-600" />,
      title: 'High-Speed Fiber Wi-Fi',
      desc: 'Dedicated minimum 100 Mbps mesh Wi-Fi to support academic coding projects, online video lectures, and exams.',
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: 'Campus Proximity & Metro Access',
      desc: 'All listed accommodations are within 15 minutes of major colleges like VNIT, RCOEM, LAD, YCCE, and Raisoni.',
    },
    {
      icon: <Users2 className="w-6 h-6 text-rose-600" />,
      title: 'Verified Student Community',
      desc: 'Live alongside like-minded engineering, medical, and commerce peers with designated quiet study hours.',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
            Why Students Trust StayMate
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-['Outfit']">
            Designed for Students, Trusted by Parents
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Finding a home near college shouldn't be stressful. We've simplified accommodation
            discovery with complete transparency, safety, and comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-5 transition-colors">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors font-['Outfit']">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
