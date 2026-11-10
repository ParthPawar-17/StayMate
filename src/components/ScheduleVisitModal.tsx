import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Phone, Mail, Sparkles } from 'lucide-react';
import { Property, User as UserType } from '../types';
import { AccommodationService } from '../services/api';
import { formatCurrency } from '../utils/accommodationLogic';

interface ScheduleVisitModalProps {
  property: Property | null;
  currentUser: UserType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  property,
  currentUser,
  onClose,
  onSuccess,
}) => {
  if (!property) return null;

  // Default to tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [visitDate, setVisitDate] = useState(defaultDate);
  const [timeSlot, setTimeSlot] = useState('Morning (10:00 AM - 12:00 PM)');
  const [sharingPreference, setSharingPreference] = useState(
    property.sharingOptions[0]?.type || 'Double'
  );
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    try {
      await AccommodationService.scheduleVisit({
        userId: currentUser?.id || 999,
        userName: name,
        userEmail: email,
        userPhone: phone,
        propertyId: property.id,
        visitDate,
        timeSlot,
        sharingPreference: `${sharingPreference} Sharing`,
        notes,
      });

      setIsConfirmed(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isConfirmed ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce-subtle">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-['Outfit']">
              Visit Request Confirmed!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your visit to <strong>{property.name}</strong> has been scheduled for{' '}
              <strong>{visitDate}</strong> ({timeSlot}). The property manager will reach out to you
              at <strong>{phone}</strong>.
            </p>
            <p className="text-xs text-purple-600 font-semibold">
              Added to your Student Dashboard under "Scheduled Visits"
            </p>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="mb-4">
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Free Campus Visit
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 font-['Outfit']">
                Schedule a Visit / Mark Interest
              </h3>
              <p className="text-xs text-slate-500">
                Book a zero-brokerage physical inspection of {property.name}.
              </p>
            </div>

            {/* Target Property Snapshot */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3 mb-5">
              <img
                src={property.image}
                alt={property.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{property.name}</p>
                <p className="text-[11px] text-slate-500">{property.location}, {property.city}</p>
                <p className="text-xs font-extrabold text-purple-700">
                  From {formatCurrency(property.price)} /mo
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Preferred Date</span>
                  </label>
                  <input
                    type="date"
                    min={defaultDate}
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Time Slot</span>
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
                  >
                    <option value="Morning (10:00 AM - 12:00 PM)">Morning (10 AM - 12 PM)</option>
                    <option value="Afternoon (01:00 PM - 03:00 PM)">Afternoon (1 PM - 3 PM)</option>
                    <option value="Evening (04:00 PM - 06:00 PM)">Evening (4 PM - 6 PM)</option>
                  </select>
                </div>
              </div>

              {/* Room Sharing Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Room Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {property.roomTypes.map((rt) => (
                    <button
                      key={rt}
                      type="button"
                      onClick={() => setSharingPreference(rt)}
                      className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
                        sharingPreference === rt
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {rt} Sharing
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter student or parent name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Inquiries / Questions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Vegetarian meal requirements, quiet study room preference"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming Visit...' : 'Confirm Free Visit Request'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
