import React, { useState } from 'react';
import { 
  Search, MapPin, Calendar, Car, Sliders, ChevronDown, 
  Map, Mail, Phone, CalendarRange, Clock, CreditCard, Shield, Heart, 
  UserPlus, CheckCircle, Info, Star, Award, Layers, Target, Compass, X,
  User as UserIcon
} from 'lucide-react';
import { Vehicle, Booking, User } from '../types';
import { INITIAL_AGENCIES } from '../data';
import StaticPortal from './StaticPortal';

interface CustomerPortalProps {
  activeView: string;
  onChangeView: (view: string) => void;
  vehicles: Vehicle[];
  bookings: Booking[];
  currentUser: User | null;
  onAddBooking: (booking: Booking) => void;
  onUpdateUser: (user: User) => void;
  onUpdateBookingStatus?: (id: string, status: 'Approved' | 'Rejected' | 'Cancelled') => void;
  onUpdateBooking?: (booking: Booking) => void;
}

export default function CustomerPortal({
  activeView,
  onChangeView,
  vehicles,
  bookings,
  currentUser,
  onAddBooking,
  onUpdateUser,
  onUpdateBookingStatus,
  onUpdateBooking
}: CustomerPortalProps) {
  // Filter bookings to only show those belonging to the logged-in user
  const userBookings = bookings.filter(b => b.customerId === currentUser?.id);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [class2W, setClass2W] = useState(true);
  const [class4W, setClass4W] = useState(true);
  const [maxPrice, setMaxPrice] = useState(300);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(['Electric', 'Hybrid', 'Petrol', 'Diesel']);
  const [sortBy, setSortBy] = useState('low_high');

  // Booking Modal
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [startDate, setStartDate] = useState('2026-06-15');
  const [endDate, setEndDate] = useState('2026-06-19');
  
  // Settings Tab
  const [settingsTab, setSettingsTab] = useState<'profile' | 'security' | 'payment' | 'notifications'>('profile');
  const [extendingBooking, setExtendingBooking] = useState<Booking | null>(null);
  const [extensionDays, setExtensionDays] = useState<number>(3);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    zip: currentUser?.zip || '',
    license: currentUser?.license || '',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  });

  // Keep profileForm in sync with currentUser context shifts
  React.useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        address: currentUser.address || '',
        city: currentUser.city || '',
        zip: currentUser.zip || '',
        license: currentUser.license || '',
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
      });
    } else {
      setProfileForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        license: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
      });
    }
  }, [currentUser]);

  // Calculate booking length block
  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? 1 : diffDays || 1;
  };

  const handleFuelToggle = (fuel: string) => {
    if (selectedFuelTypes.includes(fuel)) {
      setSelectedFuelTypes(selectedFuelTypes.filter(f => f !== fuel));
    } else {
      setSelectedFuelTypes([...selectedFuelTypes, fuel]);
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v => {
    if (!v.approved) return false;
    if (v.status !== 'Available') return false; // customer only rents available vehicles
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const targetAgency = INITIAL_AGENCIES.find(a => a.id === v.agencyId);
      const cityMatch = targetAgency ? targetAgency.city.toLowerCase().includes(term) : false;
      const nameMatch = v.name.toLowerCase().includes(term);
      const agencyMatch = v.agencyName ? v.agencyName.toLowerCase().includes(term) : false;
      if (!nameMatch && !agencyMatch && !cityMatch) return false;
    }

    // Location Filter match
    if (selectedLocation !== 'All') {
      const targetAgency = INITIAL_AGENCIES.find(a => a.id === v.agencyId);
      const city = targetAgency ? targetAgency.city : '';
      if (city.toLowerCase() !== selectedLocation.toLowerCase()) return false;
    }
    
    // Type Filter
    if (v.type === '2-Wheeler' && !class2W) return false;
    if (v.type === '4-Wheeler' && !class4W) return false;
    
    // Price Filter
    if (v.rateDay > maxPrice) return false;
    
    // Fuel Filter
    if (!selectedFuelTypes.includes(v.fuelType)) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'low_high') return a.rateDay - b.rateDay;
    if (sortBy === 'high_low') return b.rateDay - a.rateDay;
    return b.year - a.year; // Latest Year fallback
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    if (!currentUser) {
      alert("Verification Required: Please sign in or register a customer profile before booking a vehicle.");
      onChangeView('auth');
      return;
    }

    const days = calculateDays(startDate, endDate);
    const total = days * selectedVehicle.rateDay;

    const newBooking: Booking = {
      id: 'book_' + Math.random().toString(36).substr(2, 9),
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      vehicleImage: selectedVehicle.image,
      fuelType: selectedVehicle.fuelType,
      startDate: startDate,
      endDate: endDate,
      durationDays: days,
      totalAmount: total,
      status: 'Pending',
      agencyId: selectedVehicle.agencyId,
      dateSubmitted: '2026-06-03'
    };

    onAddBooking(newBooking);
    setSelectedVehicle(null);
    alert(`Success: Booking request for ${selectedVehicle.name} has been sent successfully. An agency owner will review the request shortly! You can see its state in the "My Bookings" page.`);
    onChangeView('bookings');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      onUpdateUser({
        ...currentUser,
        ...profileForm
      });
      alert('Profile details updated successfully inside localStorage context.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. CUSTOMER LANDING PAGE */}
      {activeView === 'home' && (
        <div>
          {/* Hero segment */}
          <section className="relative bg-slate-900 min-h-[500px] flex items-center text-white overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40">
              <img 
                alt="Elite Fleet" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtcZyiMhKB1OxapkUzcUUBgyO63iTE0I6JfMeBNKITmpyxOagsgsAu14XZzLeczi5-4h6JVCVI-Zf8J5MQ_DwW3v4zXiFVevuuVkPVzGhCuTPBc7xfQvqTCN3rPmkyISvFS20mJKxyVKzv111FcYmMyDnecsc7vAOt7M6tBYRpB4f09qe9NAsLofqELqh9S3h-BLpb-RMAWT9Ry0nZ9OEK6Y2Wug8acNOo7_4NtSFmPRLC62Vo9hiC3A0WvprnhGWOFIC_eXiHWUWg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16">
              <div className="max-w-2xl">
                <span className="bg-blue-600/90 text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-4 shadow">
                  ★ premium urban mobility
                </span>
                <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight leading-tight">
                  Seamless Rides for Every Destination
                </h1>
                <p className="text-lg sm:text-xl text-slate-200 mb-8 max-w-xl leading-relaxed">
                  Rent high-quality two-wheelers and four-wheelers daily, weekly, or monthly. Transparent rates, flexible durations, and instant handovers at our state-of-the-art regional hubs.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <button 
                    onClick={() => onChangeView('search')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all outline-none"
                  >
                    Browse Active Fleet
                  </button>
                  <button 
                    onClick={() => onChangeView('hubs')}
                    className="bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-semibold px-8 py-3.5 rounded-xl transition-all"
                  >
                    Our Locations
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Search bar helper component */}
          <div className="max-w-5xl mx-auto -translate-y-12 px-4 relative z-20">
            <div className="bg-white p-6 md:p-8 shadow-xl rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Keyword</label>
                <div className="flex items-center border-b border-slate-200 focus-within:border-blue-600 transition-colors py-2">
                  <Search className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                  <input 
                    className="w-full border-none p-0 focus:ring-0 text-sm text-slate-800 bg-transparent outline-none placeholder:text-slate-400" 
                    placeholder="e.g. Tesla, Range Rover" 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Port Spec</label>
                <div className="flex items-center border-b border-slate-200 focus-within:border-blue-600 transition-colors py-2">
                  <Car className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                  <select 
                    className="w-full border-none p-0 focus:ring-0 text-sm text-slate-800 bg-transparent outline-none cursor-pointer"
                    onChange={(e) => {
                      if (e.target.value === '2w') { setClass2W(true); setClass4W(false); }
                      else if (e.target.value === '4w') { setClass2W(false); setClass4W(true); }
                      else { setClass2W(true); setClass4W(true); }
                    }}
                  >
                    <option value="all">All Classes</option>
                    <option value="2w">Two-Wheelers Only</option>
                    <option value="4w">Four-Wheelers Only</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Daily Valuation</label>
                <div className="flex items-center border-b border-slate-200 focus-within:border-blue-600 transition-colors py-2">
                  <span className="text-blue-600 font-bold mr-2 text-sm">$</span>
                  <input 
                    className="w-full border-none p-0 focus:ring-0 text-sm text-slate-800 bg-transparent outline-none" 
                    type="number" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    min={50}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => onChangeView('search')}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow hover:shadow-orange-500/20 active:scale-95 transition-all text-sm uppercase tracking-wider"
                >
                  <Search className="w-4 h-4" /> Find Match
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <section className="py-12 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-slate-800">
                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">2,500+</p>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">Registered Users</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">148+</p>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">Approved Vehicles</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">80+</p>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">Active Agencies</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">99.8%</p>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">Uptime Handover</p>
                </div>
              </div>
            </div>
          </section>

          {/* Value Propositions */}
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Engineered for Fluid Travel
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                No slow operations or complex scripts. Easily reserve and start driving in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 border border-slate-200/60 rounded-2xl hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group">
                <div className="mx-auto w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Certified Support</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Continuous support desk and automated dispatch routes to solve any problems safely and quickly.
                </p>
              </div>

              <div className="bg-white p-8 border border-slate-200/60 rounded-2xl hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group">
                <div className="mx-auto w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Affordable Rate Scales</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Get high discounts automatically on weekly or monthly durations. Never worry about surprise bills.
                </p>
              </div>

              <div className="bg-white p-8 border border-slate-200/60 rounded-2xl hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group">
                <div className="mx-auto w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Vetted Partner Integrity</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  All rental agencies are thoroughly checked and verified by system administrators before onboarding.
                </p>
              </div>
            </div>
          </section>

          {/* Quick Location Guides Map Section */}
          <section className="bg-slate-100 py-16 border-t border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Active regional hubs in India</h2>
                <p className="text-sm text-slate-500 mt-2">Find a vehicle pickup block nearby across four major cities.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {[
    {
      city: 'Surat',
      img: '/surat-hub.jpg',
      desc: 'Tapi Riverfront, Dumas Road, and active Airport terminal pickups.'
    },
    {
      city: 'Ahmedabad',
      img: '/ahmedabad-hub.jpg',
      desc: 'Sabarmati Riverfront, Kalupur Terminal, and SG Highway corridors.'
    },
    {
      city: 'Vadodara',
      img: '/vadodara-hub.jpg',
      desc: 'Laxmi Vilas Palace region, Alkapuri hubs, and VIP Road stations.'
    },
    {
      city: 'Rajkot',
      img: '/rajkot-hub.jpg',
      desc: 'Watson Museum circle, Kalavad Road, and Rajkot Airport points.'
    }
  ].map(({ city, img, desc }) => (
    <div key={city} className="bg-white rounded-[1.5rem] overflow-hidden shadow-md border border-slate-200/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group" id={`city-hub-${city.toLowerCase()}`}>
      <div className="h-44 bg-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent z-10 flex items-end p-4">
          <span className="text-white font-extrabold text-xl tracking-tight drop-shadow-md group-hover:translate-x-1 transition-transform duration-300">{city}</span>
        </div>
        <img 
          src={img} 
          alt={city}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <p className="text-xs text-slate-500 mb-4 font-semibold leading-relaxed">{desc}</p>
        <button 
          onClick={() => { setSelectedLocation(city); setSearchTerm(''); onChangeView('search'); }}
          className="w-full bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 hover:border-blue-600 border border-slate-200/80 text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          Explore vehicles in {city}
        </button>
      </div>
    </div>
  ))}
</div>
            </div>
          </section>
        </div>
      )}

      {/* 2. CHOOSE VEHICLE SEARCH PAGE */}
      {activeView === 'search' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Filter Sidebar Option */}
            <aside className="lg:col-span-3 space-y-6">
              <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-8 sticky top-28">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-600" /> Filters
                  </h2>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedLocation('All');
                      setClass2W(true);
                      setClass4W(true);
                      setMaxPrice(300);
                      setSelectedFuelTypes(['Electric', 'Hybrid', 'Petrol', 'Diesel']);
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Reset All
                  </button>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Location Pickup Hub</label>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 font-semibold text-slate-700 text-sm py-2.5 pl-9 pr-10 rounded-xl focus:ring-1 focus:ring-blue-600 outline-none cursor-pointer appearance-none transition-all"
                    >
                      <option value="All">All Indian Hubs</option>
                      <option value="Surat">Surat</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Vadodara">Vadodara</option>
                      <option value="Rajkot">Rajkot</option>
                    </select>
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Search Text */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block block">Model Search</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 placeholder:text-slate-400"
                      placeholder="e.g. Tesla"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Class Category Filter */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vehicle Class</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={class2W}
                        onChange={(e) => setClass2W(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 h-5 w-5 transition-all"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-950">2W (Two-Wheelers)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={class4W}
                        onChange={(e) => setClass4W(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 h-5 w-5 transition-all"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-950">4W (Four-Wheelers)</span>
                    </label>
                  </div>
                </div>

                {/* Price Slider */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Max Daily Rate (${maxPrice})</h3>
                  <div className="px-1">
                    <input 
                      type="range" 
                      min={10}
                      max={400}
                      step={10}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs font-mono text-slate-400 mt-2">
                      <span>$10</span>
                      <span>$400+</span>
                    </div>
                  </div>
                </div>

                {/* Fuel Category Filter */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Power Propulsion</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Electric', 'Hybrid', 'Petrol', 'Diesel'].map(fuel => (
                      <button
                        key={fuel}
                        onClick={() => handleFuelToggle(fuel)}
                        className={`text-xs font-bold py-2 rounded-xl border transition-all ${
                          selectedFuelTypes.includes(fuel)
                            ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {fuel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Listings */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* Layout controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                    Active Catalog
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Showing {filteredVehicles.length} available listings matching criteria
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">Sort By:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 font-medium text-slate-700 text-xs py-2 px-3 pr-8 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none cursor-pointer"
                  >
                    <option value="low_high">Price: Low to High</option>
                    <option value="high_low">Price: High to Low</option>
                    <option value="latest">Latest Models First</option>
                  </select>
                </div>
              </div>

              {/* No match indicator */}
              {filteredVehicles.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Car className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">No Vehicles Match Your Filter Parameters</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
                    Try raising the daily pricing filter slider or choosing extra propulsion fuel tags.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedLocation('All');
                      setClass2W(true);
                      setClass4W(true);
                      setMaxPrice(300);
                      setSelectedFuelTypes(['Electric', 'Hybrid', 'Petrol', 'Diesel']);
                    }}
                    className="bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow"
                  >
                    Reset Grid
                  </button>
                </div>
              )}

              {/* Product Cards Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {filteredVehicles.map(veh => (
                  <div 
                    key={veh.id}
                    className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 flex flex-col group"
                  >
                    {/* Media frame */}
                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                      <img 
                        src={veh.image} 
                        alt={veh.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-emerald-600 border border-emerald-200/50 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        Available
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                            {veh.type}
                          </span>
                          <h3 className="font-extrabold text-[18px] text-slate-900 mt-1">
                            {veh.name}
                          </h3>
                          <p className="text-xs font-mono text-slate-400 mt-0.5 uppercase">
                            Plate: {veh.plateNo} • Model {veh.year}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-blue-600 font-extrabold text-2xl block">${veh.rateDay}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">daily block</span>
                        </div>
                      </div>

                      {/* Specifications tag layout */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium text-xs">
                          ⛽ {veh.fuelType}
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium text-xs">
                          🕹️ {veh.transmission}
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium text-xs">
                          🏢 {veh.agencyName}
                        </span>
                      </div>

                      {/* Progressive pricing plan preview context */}
                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 mb-6 grid grid-cols-2 gap-4 text-xs font-medium text-slate-500">
                        <div>
                          <p className="uppercase tracking-wider font-bold text-[9px] text-slate-400">Weekly Discount</p>
                          <p className="font-bold text-slate-800 mt-0.5">${veh.rateWeek}/week (Save)</p>
                        </div>
                        <div className="border-l border-slate-200 pl-4">
                          <p className="uppercase tracking-wider font-bold text-[9px] text-slate-400">Monthly scale</p>
                          <p className="font-bold text-slate-800 mt-0.5">${veh.rateMonth}/month</p>
                        </div>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => {
                            setSelectedVehicle(veh);
                            setStartDate('2026-06-15');
                            setEndDate('2026-06-19');
                          }}
                          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow hover:shadow-blue-500/20 active:scale-95 transition-all text-center uppercase tracking-wider"
                        >
                          Book Vehicle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. BOOKINGS AND HISTORY PAGE */}
      {activeView === 'bookings' && !currentUser && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-10 sm:p-14 text-center max-w-lg shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-2xl mb-3 text-slate-900 tracking-tight">Access Denied</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Guest profiles do not have authorization to view active travel contracts or reservation histories. Please sign in to your personal dashboard to view your booking files.
            </p>
            <button 
              onClick={() => onChangeView('auth')}
              className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      )}

      {activeView === 'bookings' && currentUser && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          
          <header className="border-b border-slate-200/60 pb-6">
            <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight">Active Reservations</h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Monitor active contract approvals, verify pricing matrix configurations, and download transactions receipts.
            </p>
          </header>

          {/* Bookings Queue */}
          <div className="space-y-6">
            {userBookings.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <CalendarRange className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-1">No Booking Records Logged</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                  You have not requested any vehicles yet in this session profile.
                </p>
                <button 
                  onClick={() => onChangeView('search')}
                  className="bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow"
                >
                  Browse Fleet Cars
                </button>
              </div>
            ) : (
              userBookings.map(book => (
                <div 
                  key={book.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="md:w-1/3 min-h-[180px] bg-slate-100 relative">
                    <img 
                      src={book.vehicleImage} 
                      alt={book.vehicleName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-200/50 text-slate-700 font-mono font-extrabold text-[10px] px-3.5 py-1.5 rounded-full shadow">
                      Reference #{book.id}
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{book.fuelType} Drive Node</span>
                          <h3 className="font-extrabold text-xl text-slate-900 mt-1">{book.vehicleName}</h3>
                        </div>
                        <div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-2 uppercase tracking-wide ${
                            book.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                              : book.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 ring-rose-200'
                              : book.status === 'Cancelled'
                              ? 'bg-slate-100 text-slate-500 ring-slate-300'
                              : 'bg-amber-50 text-amber-700 ring-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              book.status === 'Approved' ? 'bg-emerald-500' : book.status === 'Rejected' ? 'bg-rose-500' : book.status === 'Cancelled' ? 'bg-slate-400' : 'bg-amber-500'
                            }`}></span>
                            {book.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-slate-100 py-4 my-4 text-xs font-semibold text-slate-500">
                        <div>
                          <p className="uppercase tracking-wider font-bold text-[9px] text-slate-400">Duration Limits</p>
                          <p className="font-bold text-slate-800 mt-0.5">{book.durationDays} Days</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wider font-bold text-[9px] text-slate-400">Start Handover</p>
                          <p className="font-bold text-slate-800 mt-0.5">{book.startDate}</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wider font-bold text-[9px] text-slate-400">Scheduled Return</p>
                          <p className="font-bold text-slate-800 mt-0.5">{book.endDate}</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wider font-bold text-[9px] text-slate-400">Total Charge</p>
                          <p className="font-extrabold text-blue-600 text-sm mt-0.5">${book.totalAmount}.00</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 flex-wrap">
                      {(book.status === 'Pending' || book.status === 'Approved') && (
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this reservation?')) {
                              onUpdateBookingStatus?.(book.id, 'Cancelled');
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                        >
                          Cancel Reservation
                        </button>
                      )}
                      {book.status === 'Approved' && (
                        <button 
                          onClick={() => {
                            setExtendingBooking(book);
                            setExtensionDays(3);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition-all duration-150 uppercase tracking-wider cursor-pointer animate-pulse"
                        >
                          Extend Rental
                        </button>
                      )}
                      <button 
                        onClick={() => alert(`Details Map Instance: GPS and agency terminal collection configurations can be accessed at Surat Central office regarding reservation token #${book.id}.`)}
                        className="bg-white hover:bg-slate-100 text-slate-755 border border-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Help Support
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. STATIC CONTENT PAGES */}
      {['about', 'story', 'careers', 'corporate', 'privacy', 'terms', 'cookies', 'help', 'emergency', 'hubs'].includes(activeView) && (
        <StaticPortal activeView={activeView} onChangeView={onChangeView} />
      )}

      {/* 5. USER SETTINGS */}
      {activeView === 'settings' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          {!currentUser ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-6 max-w-2xl mx-auto shadow-sm my-12 animate-fade-in">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Authentication Required</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto font-medium leading-relaxed">
                  You are currently accessing RentiGo as a guest. Please sign in or register to view and configure accounts, permit indexes, and payment credentials.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => onChangeView('home')}
                  className="px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Return Home
                </button>
                <button
                  onClick={() => onChangeView('auth')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Sign In / Register
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* Header Area */}
              <header className="border-b pb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-950 tracking-tight uppercase">Account Management</h1>
                  <p className="text-xs text-slate-400 mt-1 font-medium text-slate-500">Configure personal account details, physical travel permit indexes, and payment methodologies.</p>
                </div>
                {settingsTab === 'profile' && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentUser) {
                        onUpdateUser({
                          ...currentUser,
                          ...profileForm
                        });
                        alert('Client Profile Synchronized: Administrative customer file saved securely.');
                      } else {
                        alert('Signature Error: Authenticate a guest credentials account first before locking changes.');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md self-start sm:self-center cursor-pointer"
                  >
                    Save Profile
                  </button>
                )}
              </header>
              
              {/* Tabs Row */}
              <div className="bg-slate-200/60 border border-slate-300/40 p-1.5 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-1.5 shadow-inner">
                <button 
                  onClick={() => setSettingsTab('profile')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all text-xs uppercase tracking-wider font-extrabold ${
                    settingsTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>👤 Profile Details</span>
                </button>
                <button 
                  onClick={() => setSettingsTab('security')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all text-xs uppercase tracking-wider font-extrabold ${
                    settingsTab === 'security' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>🔒 Security Node</span>
                </button>
                <button 
                  onClick={() => setSettingsTab('payment')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all text-xs uppercase tracking-wider font-extrabold ${
                    settingsTab === 'payment' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>💳 Payment Cards</span>
                </button>
                <button 
                  onClick={() => setSettingsTab('notifications')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all text-xs uppercase tracking-wider font-extrabold ${
                    settingsTab === 'notifications' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>🔔 Notification Matrix</span>
                </button>
              </div>

            {/* Profile Tab */}
            {settingsTab === 'profile' && (
              <div className="space-y-8 animate-fade-in text-xs font-semibold">
                
                {/* Guest Block Check */}
                {!currentUser && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 font-bold mb-4">
                    Guest Account Scope: State parameters reflect sandbox attributes. Authorize a permanent member token to access persistent write cycles.
                  </div>
                )}

                {/* Corporate User Hero profile display */}
                <div className="p-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl flex flex-col sm:flex-row items-center gap-6 text-white relative overflow-hidden shadow-md">
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mb-8"></div>
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/40 bg-slate-800 shrink-0 shadow-inner">
                    <img 
                      src={profileForm.avatar} 
                      alt={profileForm.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
                      }}
                    />
                  </div>
                  <div className="text-center sm:text-left space-y-1.5 z-10">
                    <h3 className="font-extrabold text-lg tracking-tight text-white">{profileForm.name}</h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="inline-block bg-white/15 border border-white/20 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                        Verified Member • Tier 1
                      </span>
                      <span className="text-[10px] font-mono text-blue-100 uppercase font-black">Registered Permit: {profileForm.license}</span>
                    </div>
                  </div>
                </div>

                {/* Form fields parameters */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (currentUser) {
                      onUpdateUser({
                        ...currentUser,
                        ...profileForm
                      });
                      alert('Client Profile Synchronized: Administrative customer file saved securely.');
                    }
                  }} 
                  className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8"
                >
                  <div className="border-b pb-4">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-widest leading-none">Modify Personal Metadata</h3>
                    <p className="text-slate-400 text-[11px] mt-1">Adjust parameters used in auto-populating reservation contracts.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Client Full Name</label>
                      <input 
                        type="text" 
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold outline-none focus:bg-white focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Email Address</label>
                      <input 
                        type="email" 
                        value={profileForm.email} 
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold outline-none focus:bg-white focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Phone Number</label>
                      <input 
                        type="text" 
                        value={profileForm.phone} 
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold outline-none focus:bg-white focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Driver License Permit PIN</label>
                      <input 
                        type="text" 
                        value={profileForm.license} 
                        onChange={(e) => setProfileForm({...profileForm, license: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none focus:bg-white focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">HQ Residential Address</label>
                      <input 
                        type="text" 
                        value={profileForm.address} 
                        onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold outline-none focus:bg-white focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">City Location</label>
                      <input 
                        type="text" 
                        value={profileForm.city} 
                        onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold outline-none focus:bg-white focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Zip Code</label>
                      <input 
                        type="text" 
                        value={profileForm.zip} 
                        onChange={(e) => setProfileForm({...profileForm, zip: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold outline-none focus:bg-white focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Profile Avatar Image URL</label>
                      <input 
                        type="text" 
                        value={profileForm.avatar} 
                        onChange={(e) => setProfileForm({...profileForm, avatar: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold outline-none focus:bg-white focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow cursor-pointer">
                      Save Profile Parameters
                    </button>
                  </div>
                </form>

                {/* Travel Compliance Integrity logs */}
                <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm uppercase tracking-widest">
                      Your Fleet Travel compliance Records
                    </h3>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Secured via SHA-256 Protocol</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { date: 'Jun 22, 2026 - 15:00', action: 'Requested Tesla Model 3 Rented Contract', ip: '192.168.1.104', state: 'success' },
                      { date: 'Jun 19, 2026 - 09:12', action: 'Updated security node payment benchmark profile', ip: '192.168.1.104', state: 'success' },
                      { date: 'Jun 05, 2026 - 11:32', action: 'Verified driving credentials permit validation pass', ip: '10.0.1.233', state: 'success' }
                    ].map((log, i) => (
                      <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/60 rounded-xl font-mono text-[11px] text-slate-600 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="font-bold text-slate-900">{log.action}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                          <span>IP: {log.ip}</span>
                          <span className="font-bold text-slate-500">{log.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Other Tab Panels */}
            {settingsTab === 'security' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl space-y-6">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Password Matrix Modification</h3>
                <div className="space-y-4">
                  <input type="password" placeholder="Current Security Key" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-blue-600" />
                  <input type="password" placeholder="New Security Key" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-blue-600" />
                  <button 
                    onClick={() => alert('Operational Alert: Password modified successfully.')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider"
                  >
                    Update Key
                  </button>
                </div>
              </div>
            )}

            {settingsTab === 'payment' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl space-y-6">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Registered Payment Methods</h3>
                <div className="border border-slate-200 p-4 rounded-xl flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-bold text-sm text-slate-800">Visa ending in •••• 4242</p>
                      <p className="text-xs text-slate-400">Expires 08 / 2028</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase">primary</span>
                </div>
              </div>
            )}

            {settingsTab === 'notifications' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl space-y-6">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Notification Routing Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <div>
                      <p className="font-bold text-sm text-slate-800">Booking Status Modification Alerts</p>
                      <p className="text-xs text-slate-400">Receive transactional sms/inbox notices instantly when approved.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-0" />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <div>
                      <p className="font-bold text-sm text-slate-800">Promotions & Fleet Updates</p>
                      <p className="text-xs text-slate-400">Periodic newsletters outlining seasonal and peak price adjustments.</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-0" />
                  </label>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      )}

      {/* 6. BOOKING CONFIRMATION MODAL FLOATING DIALOGUE */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden">
            {/* Modal Navigation header */}
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px] text-blue-400">calendar_month</span>
                <div>
                  <h3 className="text-xl font-bold">Configure Handover Metrics</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Define duration limits and view calculations rules.</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 sm:p-8 space-y-6">
              
              {/* Product preview line context */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <div className="w-20 h-14 bg-slate-200 rounded-lg overflow-hidden border">
                  <img src={selectedVehicle.image} alt={selectedVehicle.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 uppercase font-bold">{selectedVehicle.type}</p>
                  <h4 className="font-extrabold text-slate-900">{selectedVehicle.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Daily rate block: ${selectedVehicle.rateDay}.00</p>
                </div>
              </div>

              {/* Form Input Elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Handover Start Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-blue-600"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Handover End Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-blue-600"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Dynamic Price Calculation Matrix box */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex justify-between items-center sm:grid-cols-3 text-xs font-semibold">
                <div>
                  <p className="uppercase tracking-widest font-bold text-[9px] text-slate-400">Total Days Duration</p>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{calculateDays(startDate, endDate)} Days</p>
                </div>
                <div>
                  <p className="uppercase tracking-widest font-bold text-[9px] text-slate-400">Billing Basis</p>
                  <p className="font-medium text-slate-500 mt-0.5">${selectedVehicle.rateDay}/day x {calculateDays(startDate, endDate)}</p>
                </div>
                <div className="text-right border-l border-blue-200/60 pl-6 shrink-0">
                  <p className="uppercase tracking-widest font-bold text-[9px] text-blue-500">Calculated sum</p>
                  <p className="font-black text-blue-700 text-lg sm:text-xl mt-0.5">${calculateDays(startDate, endDate) * selectedVehicle.rateDay}.00</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-xl text-xs text-amber-800 leading-relaxed font-semibold">
                🔔 Note: Once submitted, the booking moves directly to 'Pending' inside the parent Rental Agency approval queue. You will receive updates in real-time.
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-4 border-t">
                <button 
                  type="button"
                  onClick={() => setSelectedVehicle(null)}
                  className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-3 rounded-xl shadow uppercase tracking-wider"
                >
                  Confirm Request
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* RENTAL EXTENSION MODAL */}
      {extendingBooking && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-fade-in">
            <header className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg uppercase tracking-tight">Extend Active Reservation</h3>
                <p className="text-slate-400 text-xs mt-0.5">Increment rental limits and recalculate active billing matrices.</p>
              </div>
              <button 
                onClick={() => setExtendingBooking(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 border p-4 rounded-2xl space-y-1.5 text-xs">
                <p className="font-bold text-slate-800 uppercase tracking-widest text-[9px]">Target Asset Node</p>
                <p className="font-extrabold text-sm text-slate-900">{extendingBooking.vehicleName}</p>
                <p className="text-slate-500 font-semibold">Current Checkout Limits: {extendingBooking.startDate} to {extendingBooking.endDate} ({extendingBooking.durationDays} Days)</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Additional Extension Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 5, 7].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setExtensionDays(days)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        extensionDays === days 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      +{days} Days
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Or enter custom days</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={extensionDays}
                    onChange={(e) => setExtensionDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-blue-650 focus:bg-white"
                  />
                </div>
              </div>

              {/* Recalculation Summary Box */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-3 text-xs font-semibold text-slate-650">
                <div className="flex justify-between items-center">
                  <span>Additional Duration:</span>
                  <span className="font-extrabold text-slate-900">+{extensionDays} Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>New Total Duration:</span>
                  <span className="font-extrabold text-slate-900">{extendingBooking.durationDays + extensionDays} Days</span>
                </div>
                <div className="flex justify-between items-center border-t border-blue-200/50 pt-2 text-sm">
                  <span className="text-blue-600 font-extrabold">Additional Amount due:</span>
                  <span className="text-blue-700 font-black">${extensionDays * (vehicles.find(v => v.id === extendingBooking.vehicleId)?.rateDay || 100)}.00</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendingBooking(null)}
                  className="flex-1 px-4 py-3 border rounded-xl font-bold text-xs uppercase text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const dailyRate = vehicles.find(v => v.id === extendingBooking.vehicleId)?.rateDay || 100;
                    const additionalAmount = extensionDays * dailyRate;
                    
                    // Parse old end date
                    const oldEnd = new Date(extendingBooking.endDate);
                    oldEnd.setDate(oldEnd.getDate() + extensionDays);
                    const newEndDateStr = oldEnd.toISOString().split('T')[0];

                    const updated: Booking = {
                      ...extendingBooking,
                      durationDays: extendingBooking.durationDays + extensionDays,
                      endDate: newEndDateStr,
                      totalAmount: extendingBooking.totalAmount + additionalAmount
                    };

                    onUpdateBooking?.(updated);
                    setExtendingBooking(null);
                    alert(`Extension Approved: Reservation token #${extendingBooking.id} extended safely. Your updated return date is ${newEndDateStr}.`);
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Confirm Extension
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}