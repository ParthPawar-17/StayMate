import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Search,
  IndianRupee,
  Calendar,
  Sparkles,
  X,
  Phone,
  Mail,
  Filter,
} from 'lucide-react';
import { Property, User as UserType, InterestedLead, Amenity } from '../types';
import { AccommodationService } from '../services/api';
import { formatCurrency, validatePropertyForm } from '../utils/accommodationLogic';

interface AdminDashboardProps {
  currentUser: UserType | null;
  properties: Property[];
  onRefreshProperties: () => void;
  onOpenExplore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  properties,
  onRefreshProperties,
  onOpenExplore,
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'leads' | 'amenities'>('properties');
  const [leads, setLeads] = useState<InterestedLead[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  // Search in admin table
  const [tableSearch, setTableSearch] = useState('');

  // Add/Edit Property Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null);

  // Property Form State
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('Nagpur');
  const [formLocation, setFormLocation] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPrice, setFormPrice] = useState(6000);
  const [formDeposit, setFormDeposit] = useState(6000);
  const [formGender, setFormGender] = useState<'Boys' | 'Girls' | 'Co-living'>('Boys');
  const [formImage, setFormImage] = useState(
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'
  );
  const [formDescription, setFormDescription] = useState('');
  const [formOwner, setFormOwner] = useState('StayMate Verified Host');
  const [formOwnerPhone, setFormOwnerPhone] = useState('+91 98220 00000');
  const [formAmenities, setFormAmenities] = useState<string[]>([
    'High-speed WiFi',
    'Food Included (3 Meals)',
    'CCTV & Biometric Security',
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    AccommodationService.getAllInterestedLeads().then(setLeads);
    AccommodationService.getAmenities().then(setAmenities);
  }, []);

  // Admin access protection
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
          Access Denied: Admin Authorization Required
        </h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          You need an administrator account to view property listings management, student inquiries,
          and system controls.
        </p>
        <button
          onClick={onOpenExplore}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          Return to Accommodations
        </button>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingPropertyId(null);
    setFormName('');
    setFormCity('Nagpur');
    setFormLocation('');
    setFormAddress('');
    setFormPrice(6000);
    setFormDeposit(6000);
    setFormGender('Boys');
    setFormImage(
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'
    );
    setFormDescription(
      'Hygienic, comfortable student accommodation with nutritious meals and quiet study hours.'
    );
    setFormOwner('Hostel Manager');
    setFormOwnerPhone('+91 98220 00000');
    setFormAmenities(['High-speed WiFi', 'Food Included (3 Meals)', 'CCTV & Biometric Security']);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setFormName(prop.name);
    setFormCity(prop.city);
    setFormLocation(prop.location);
    setFormAddress(prop.address);
    setFormPrice(prop.price);
    setFormDeposit(prop.deposit);
    setFormGender(prop.gender);
    setFormImage(prop.image);
    setFormDescription(prop.description);
    setFormOwner(prop.contactOwner);
    setFormOwnerPhone(prop.contactPhone);
    setFormAmenities(prop.amenities);
    setFormError(null);
    setModalOpen(true);
  };

  const handleDeleteProperty = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from StayMate?`)) {
      await AccommodationService.deleteProperty(id);
      onRefreshProperties();
      setSuccessToast(`Property "${name}" successfully deleted.`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = validatePropertyForm({
      name: formName,
      city: formCity,
      location: formLocation,
      price: formPrice,
      gender: formGender,
      description: formDescription,
      image: formImage,
    });

    if (!validation.valid) {
      setFormError(Object.values(validation.errors)[0]);
      return;
    }

    if (editingPropertyId) {
      // Edit existing
      await AccommodationService.updateProperty(editingPropertyId, {
        name: formName,
        city: formCity,
        location: formLocation,
        address: formAddress || `${formLocation}, ${formCity}`,
        price: formPrice,
        deposit: formDeposit,
        gender: formGender,
        image: formImage,
        description: formDescription,
        contactOwner: formOwner,
        contactPhone: formOwnerPhone,
        amenities: formAmenities,
      });
      setSuccessToast(`Property "${formName}" updated successfully!`);
    } else {
      // Add new
      await AccommodationService.addProperty({
        name: formName,
        city: formCity,
        location: formLocation,
        address: formAddress || `${formLocation}, ${formCity}`,
        price: formPrice,
        deposit: formDeposit,
        gender: formGender,
        image: formImage,
        description: formDescription,
        gallery: [formImage],
        roomTypes: ['Single', 'Double', 'Triple'],
        sharingOptions: [
          { type: 'Single', price: formPrice + 3000, available: 2, deposit: formDeposit + 3000 },
          { type: 'Double', price: formPrice, available: 4, deposit: formDeposit },
          { type: 'Triple', price: formPrice - 1000, available: 6, deposit: formDeposit - 1000 },
        ],
        amenities: formAmenities,
        facilities: ['Geyser', 'RO Water', 'Power Backup'],
        rules: ['Curfew 10:00 PM', 'No smoking'],
        nearestColleges: [{ name: 'VNIT Nagpur', distance: '1.2 km', travelTime: '12 min walk' }],
        contactOwner: formOwner,
        contactPhone: formOwnerPhone,
        verified: true,
        featured: false,
      });
      setSuccessToast(`New Property "${formName}" listed successfully!`);
    }

    onRefreshProperties();
    setModalOpen(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleUpdateLeadStatus = async (leadId: number, newStatus: InterestedLead['status']) => {
    await AccommodationService.updateLeadStatus(leadId, newStatus);
    const updated = await AccommodationService.getAllInterestedLeads();
    setLeads(updated);
  };

  const filteredProperties = properties.filter(
    (p) =>
      p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>StayMate Admin Console</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] mt-1">
            Property & Student Inquiries Management
          </h1>
          <p className="text-xs text-slate-500">
            Authenticated as <strong>{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New PG Property</span>
        </button>
      </div>

      {successToast && (
        <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Admin KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Total Properties</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-['Outfit']">{properties.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Active student accommodations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Interested Leads</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-600 font-['Outfit']">{leads.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Booked student visits</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Registered Students</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-['Outfit']">1,248</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Across Nagpur colleges</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Avg Monthly Rent</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 font-['Outfit']">₹6,200</p>
          <p className="text-[11px] text-slate-400 mt-1">Including 3-time meals</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 mt-8 pb-3">
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'properties'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Properties Management ({properties.length})
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leads'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Student Visit Inquiries ({leads.length})
        </button>

        <button
          onClick={() => setActiveTab('amenities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'amenities'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System Amenities ({amenities.length})
        </button>
      </div>

      {/* Tab 1: Properties Management */}
      {activeTab === 'properties' && (
        <div className="mt-6 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Table Search Bar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search PG by name or area..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <p className="text-xs text-slate-400">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Rent / Mo</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prop.image}
                          alt={prop.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{prop.name}</p>
                          <p className="text-[11px] text-slate-500">{prop.roomTypes.join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {prop.location}, {prop.city}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prop.gender === 'Boys'
                            ? 'bg-blue-100 text-blue-800'
                            : prop.gender === 'Girls'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {prop.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-slate-900">
                      {formatCurrency(prop.price)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-amber-700">
                      ★ {prop.rating} ({prop.reviewCount})
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(prop)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-600 transition-colors"
                          title="Edit Property"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(prop.id, prop.name)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Student Inquiries / Leads */}
      {activeTab === 'leads' && (
        <div className="mt-6 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Student Visit Bookings & Expressions of Interest
            </h3>
            <p className="text-xs text-slate-500">
              Manage inquiries, update visit status, and connect students with wardens.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Student Info</th>
                  <th className="px-4 py-3">Target PG</th>
                  <th className="px-4 py-3">Scheduled Date</th>
                  <th className="px-4 py-3">Room Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{lead.userName}</p>
                      <p className="text-[11px] text-slate-500">{lead.userEmail}</p>
                      <p className="text-[11px] text-purple-600 font-semibold">{lead.userPhone}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {lead.propertyName}
                      <p className="text-[11px] text-slate-400">{lead.propertyLocation}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-800">{lead.visitDate}</p>
                      <p className="text-[11px] text-slate-500">{lead.timeSlot}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {lead.sharingPreference}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lead.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.status === 'Visit Scheduled'
                            ? 'bg-purple-100 text-purple-800'
                            : lead.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleUpdateLeadStatus(lead.id, e.target.value as InterestedLead['status'])
                        }
                        aria-label={`Update status for lead ${lead.id}`}
                        className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 font-semibold text-slate-700 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Visit Scheduled">Visit Scheduled</option>
                        <option value="Confirmed">Confirmed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Amenities Master */}
      {activeTab === 'amenities' && (
        <div className="mt-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Master Amenities & Student Facilities Database
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenities.map((a) => (
              <div
                key={a.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-800">{a.name}</p>
                  <span className="text-[10px] text-purple-600 font-semibold">{a.category}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Property Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-1 font-['Outfit']">
                {editingPropertyId ? 'Edit Property Information' : 'List New Student PG Property'}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill in realistic accommodation details, pricing, and available amenities.
              </p>

              {formError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveProperty} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Property Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Royal Palms Boys Residency"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Locality / Area
                    </label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Ramdaspeth, Dharampeth"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Street Address
                  </label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Plot / Street / Landmark"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Starting Rent (₹/mo)
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Security Deposit (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formDeposit}
                      onChange={(e) => setFormDeposit(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender Type
                    </label>
                    <select
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Boys">Boys PG</option>
                      <option value="Girls">Girls PG</option>
                      <option value="Co-living">Co-living</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Property Photo URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Warden / Host Name
                    </label>
                    <input
                      type="text"
                      value={formOwner}
                      onChange={(e) => setFormOwner(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formOwnerPhone}
                      onChange={(e) => setFormOwnerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
                  >
                    {editingPropertyId ? 'Update Property' : 'Publish PG Property'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
