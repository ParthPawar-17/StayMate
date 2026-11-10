import React from 'react';
import { MapPin, ArrowRight, Building } from 'lucide-react';

interface PopularLocationsProps {
  onSelectLocation: (locality: string) => void;
}

export const PopularLocations: React.FC<PopularLocationsProps> = ({ onSelectLocation }) => {
  const hubs = [
    {
      name: 'Ramdaspeth',
      city: 'Nagpur',
      count: '18+ PGs',
      landmark: 'Near VNIT & LIT',
      image:
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Dharampeth',
      city: 'Nagpur',
      count: '24+ PGs',
      landmark: 'Near LAD College & WHC Rd',
      image:
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Sadar / Civil Lines',
      city: 'Nagpur',
      count: '15+ PGs',
      landmark: 'Near RCOEM & St. Francis',
      image:
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Hingna Road',
      city: 'Nagpur',
      count: '32+ PGs',
      landmark: 'Near YCCE, Raisoni & PCE',
      image:
        'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Bajaj Nagar',
      city: 'Nagpur',
      count: '12+ PGs',
      landmark: 'Near VNIT South Gate & Metro',
      image:
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Pratap Nagar',
      city: 'Nagpur',
      count: '16+ PGs',
      landmark: 'Near Orange City Hospital & GMC',
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Campus Neighborhoods
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-['Outfit']">
              Popular Student Hubs in Nagpur
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Browse top localities with vibrant student crowds, food streets, and metro connectivity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {hubs.map((hub, idx) => (
            <div
              key={idx}
              onClick={() => onSelectLocation(hub.name)}
              className="group cursor-pointer bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-purple-300 hover:shadow-lg transition-all text-center flex flex-col justify-between"
            >
              <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3">
                <img
                  src={hub.image}
                  alt={hub.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {hub.count}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-purple-600 transition-colors font-['Outfit']">
                  {hub.name}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{hub.landmark}</p>
              </div>
              <div className="mt-2 text-[10px] text-purple-600 font-bold flex items-center justify-center space-x-1 group-hover:underline">
                <span>View PGs</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
