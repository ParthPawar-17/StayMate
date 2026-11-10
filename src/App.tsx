import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertyListings } from './components/PropertyListings';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ScheduleVisitModal } from './components/ScheduleVisitModal';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CollegeProjectModal } from './components/CollegeProjectModal';
import { CompareModal } from './components/CompareModal';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PopularLocations } from './components/PopularLocations';
import { HowItWorks } from './components/HowItWorks';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';

import { Property, FilterState, User } from './types';
import { AccommodationService } from './services/api';
import { INITIAL_PROPERTIES, DEMO_USERS } from './data/mockData';
import { CheckCircle2, Heart } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS[0]);
  const [activeView, setActiveView] = useState<
    'home' | 'explore' | 'student-dashboard' | 'admin-dashboard'
  >('home');

  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [allRawProperties, setAllRawProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [shortlist, setShortlist] = useState<number[]>([1, 2]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    city: 'Nagpur',
    gender: 'All',
    roomType: 'All',
    minBudget: 0,
    maxBudget: 25000,
    amenities: [],
    sortBy: 'popular',
    collegeFilter: '',
  });

  // Modal States
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState<Property | null>(null);
  const [selectedPropertyVisit, setSelectedPropertyVisit] = useState<Property | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [projectDocsOpen, setProjectDocsOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);

  // Initialize data
  const loadData = async () => {
    setIsLoading(true);
    const user = AccommodationService.getCurrentUser();
    setCurrentUser(user);
    const short = AccommodationService.getShortlist();
    setShortlist(short);

    const { properties: allProps } = await AccommodationService.getProperties();
    setAllRawProperties(allProps);

    const { properties: filtered } = await AccommodationService.getProperties(filters);
    setProperties(filtered);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update properties when filters change
  useEffect(() => {
    setIsLoading(true);
    AccommodationService.getProperties(filters).then(({ properties: filtered }) => {
      setProperties(filtered);
      setIsLoading(false);
    });
  }, [filters]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleHeroSearch = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    setActiveView('explore');
    setTimeout(() => {
      document.getElementById('property-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectLocality = (locality: string) => {
    setFilters({ ...filters, searchTerm: locality, city: 'Nagpur' });
    setActiveView('explore');
    setTimeout(() => {
      document.getElementById('property-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleToggleShortlist = (propertyId: number) => {
    const { added, list } = AccommodationService.toggleShortlist(propertyId);
    setShortlist(list);
    showToast(
      added ? 'Saved to your Shortlist! View in Dashboard.' : 'Removed from your Shortlist.'
    );
  };

  const handleViewDetails = (property: Property) => {
    setSelectedPropertyDetail(property);
    AccommodationService.recordRecentlyViewed(property.id);
  };

  const handleOpenScheduleVisit = (property: Property) => {
    setSelectedPropertyVisit(property);
  };

  const handleLogout = async () => {
    await AccommodationService.logout();
    setCurrentUser(null);
    setActiveView('home');
    showToast('You have been signed out successfully.');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleSwitchRole = async () => {
    try {
      if (currentUser?.role === 'admin') {
        const student = await AccommodationService.login('rahul.sharma@vnit.ac.in', 'student123');
        setCurrentUser(student);
        showToast('Switched to Student mode (Rahul Sharma)');
      } else {
        const admin = await AccommodationService.login('admin@staymate.in', 'admin123');
        setCurrentUser(admin);
        showToast('Switched to Admin mode (StayMate Official)');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const shortlistedProperties = allRawProperties.filter((p) => shortlist.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-purple-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-purple-500/50 flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        shortlistCount={shortlist.length}
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProjectDocs={() => setProjectDocsOpen(true)}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection
              onSearch={handleHeroSearch}
              onExploreClick={() => setActiveView('explore')}
            />
            <PropertyListings
              properties={properties.slice(0, 6)}
              filters={filters}
              onFilterChange={setFilters}
              shortlist={shortlist}
              onToggleShortlist={handleToggleShortlist}
              onViewDetails={handleViewDetails}
              onInterestedClick={handleOpenScheduleVisit}
              onOpenCompare={() => setCompareModalOpen(true)}
              isLoading={isLoading}
            />
            <PopularLocations onSelectLocation={handleSelectLocality} />
            <WhyChooseUs />
            <HowItWorks />
            <TestimonialsSection />
          </>
        )}

        {activeView === 'explore' && (
          <div className="pt-4 pb-16">
            <PropertyListings
              properties={properties}
              filters={filters}
              onFilterChange={setFilters}
              shortlist={shortlist}
              onToggleShortlist={handleToggleShortlist}
              onViewDetails={handleViewDetails}
              onInterestedClick={handleOpenScheduleVisit}
              onOpenCompare={() => setCompareModalOpen(true)}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeView === 'student-dashboard' && (
          <StudentDashboard
            currentUser={currentUser}
            properties={allRawProperties}
            shortlistIds={shortlist}
            onToggleShortlist={handleToggleShortlist}
            onViewDetails={handleViewDetails}
            onLogout={handleLogout}
            onOpenExplore={() => setActiveView('explore')}
            onOpenCompare={() => setCompareModalOpen(true)}
          />
        )}

        {activeView === 'admin-dashboard' && (
          <AdminDashboard
            currentUser={currentUser}
            properties={allRawProperties}
            onRefreshProperties={loadData}
            onOpenExplore={() => setActiveView('explore')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenProjectDocs={() => setProjectDocsOpen(true)}
        onSelectLocality={handleSelectLocality}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Modals */}
      <PropertyDetailModal
        property={selectedPropertyDetail}
        currentUser={currentUser}
        isShortlisted={selectedPropertyDetail ? shortlist.includes(selectedPropertyDetail.id) : false}
        onToggleShortlist={handleToggleShortlist}
        onClose={() => setSelectedPropertyDetail(null)}
        onOpenScheduleVisit={(prop) => {
          setSelectedPropertyDetail(null);
          setSelectedPropertyVisit(prop);
        }}
      />

      <ScheduleVisitModal
        property={selectedPropertyVisit}
        currentUser={currentUser}
        onClose={() => setSelectedPropertyVisit(null)}
        onSuccess={() => {
          showToast('Visit request confirmed! Check your Student Dashboard.');
          loadData();
        }}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <CollegeProjectModal
        isOpen={projectDocsOpen}
        onClose={() => setProjectDocsOpen(false)}
      />

      <CompareModal
        properties={shortlistedProperties}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onRemoveFromShortlist={handleToggleShortlist}
        onOpenScheduleVisit={handleOpenScheduleVisit}
      />
    </div>
  );
}
