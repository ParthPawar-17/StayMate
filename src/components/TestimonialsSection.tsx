import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Aditya Kulkarni',
      college: 'VNIT Nagpur (3rd Year, Computer Science)',
      rating: 5,
      pgName: 'Shree Ram Luxury Boys PG, Ramdaspeth',
      quote:
        'StayMate made finding a PG near VNIT completely hassle-free. The 3-time meals taste just like home food, and being able to walk to campus in 8 minutes saves me so much commute time every single morning.',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Sneha Deshmukh',
      college: 'LAD College for Women (2nd Year, BBA)',
      rating: 5,
      pgName: 'Saraswati Girls Executive Residency, Dharampeth',
      quote:
        'As a girl shifting from Amravati to Nagpur, safety was my family’s #1 priority. The biometric access, female warden, and quiet study hours make Saraswati Residency feel just like home.',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Gaurav Pachpore',
      college: 'RCOEM Nagpur (M.Tech)',
      rating: 5,
      pgName: 'CampusNest Co-Living Spaces, Sadar',
      quote:
        'The rooftop co-working lounge and 300 Mbps mesh internet are unbelievable. No brokerage, and I was able to schedule a room tour right from my phone within seconds.',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30">
            Student Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 font-['Outfit']">
            Loved by 10,000+ Students Across Nagpur
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Hear from engineering, medical, and arts students living comfortably in StayMate verified
            homes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-purple-400/30" />
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="mt-4 pt-3 border-t border-slate-700/60">
                  <span className="text-[11px] font-semibold text-purple-300">
                    Stayed at: {t.pgName}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center space-x-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-purple-500/40"
                />
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center space-x-1">
                    <span>{t.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h3>
                  <p className="text-[11px] text-slate-400">{t.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
