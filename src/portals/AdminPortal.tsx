import React, { useState } from 'react';
import { 
  Shield, Users, Building, Car, MapPin, DollarSign, Activity, FileText, Settings,
  ArrowUpRight, CheckCircle, XCircle, Search, AlertCircle, RefreshCw, BarChart2,
  TrendingUp, Globe, Clock, Server, Play, Heart, Star, Compass, Map, Radio, AlertTriangle,
  ChevronRight, Plus, Trash2, Sliders, Database, Cpu, History, UserCheck, Eye, Sparkles, Filter,
  Settings2, ChevronDown, Check, Info, Ban, LogOut, ShieldAlert
} from 'lucide-react';
import { User, Vehicle, Booking, Agency, PricingClass, PricingRule, SystemAlert } from '../types';

interface AdminPortalProps {
  activeView: string;
  onChangeView: (view: string) => void;
  users: User[];
  vehicles: Vehicle[];
  bookings: Booking[];
  agencies: Agency[];
  pricingClasses: PricingClass[];
  pricingRules: PricingRule[];
  systemAlerts: SystemAlert[];
  onApproveVehicle: (id: string) => void;
  onApproveAgency: (id: string, approve: boolean) => void;
  onToggleRule: (id: string) => void;
  onUpdateUser?: (updatedUser: User) => void;
  onUpdateVehicle?: (updatedVeh: Vehicle) => void;
  onDeleteVehicle?: (id: string) => void;
}

export default function AdminPortal({
  activeView,
  onChangeView,
  users,
  vehicles,
  bookings,
  agencies,
  pricingClasses,
  pricingRules,
  systemAlerts,
  onApproveVehicle,
  onApproveAgency,
  onToggleRule,
  onUpdateUser,
  onUpdateVehicle,
  onDeleteVehicle
}: AdminPortalProps) {

  // Local state for interactive enhancements
  const [userSearch, setUserSearch] = useState('');
  const [agencySearch, setAgencySearch] = useState('');
  const [listingSearch, setListingSearch] = useState('');
  
  const [selectedUserRole, setSelectedUserRole] = useState('All Roles');
  const [selectedAgencyTier, setSelectedAgencyTier] = useState('All');
  const [selectedTrackingRegion, setSelectedTrackingRegion] = useState<string>('SURAT');

  // Custom persistent Account state for root supervisor
  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem('rentigo_admin_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Alexander Sterling',
      email: 'alex.sterling@rentigo.in',
      phone: '+91 98250 99999',
      pin: 'SEC-7890',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDocLC2umusq4s4YgjAl0kgxz3AZ61mKVL2Fn8OTDQCF6t4B685w5vILkklaIJ-XhAFcR9LduU89QGFsIblMWm-a3QB4jFquDi9oh00jR63uwp1VP2Vxwn2ExxCjfLV9-IqeKwTK6xzfXSVqpENFCNaZiLH0SvTuKloKIG1_iYVifp5osAt2okIjTCfB62DY6s30ftjYWw8jfs5Tnw-x_1d8RZbnT3FEKhp-nqOq4RHwVugVVJiWQ7LAKYLQc8DC3GBtbl7YMGWpAyq',
      role: 'Root Executive',
      timezone: 'New Delhi Standard Time (IST +05:30)',
      currency: 'INR (₹) - Indian Rupee Segment'
    };
  });

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('rentigo_admin_profile', JSON.stringify(adminProfile));
    alert("Administrative Account Updated: Profile records and configuration secured in platform storage.");
  };

  // Dynamic simulation states
  const [simulatedRevenueBoost, setSimulatedRevenueBoost] = useState(0);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [localSystemAlerts, setLocalSystemAlerts] = useState<SystemAlert[]>(systemAlerts);
  const [simulatedServerLoad, setSimulatedServerLoad] = useState<number>(45);
  const [simulatedDbConnections, setSimulatedDbConnections] = useState<number>(62);
  const [isPurgingCache, setIsPurgingCache] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);

  // Inspector and details state
  const [selectedUserForInspect, setSelectedUserForInspect] = useState<User | null>(null);
  const [selectedAgencyForInspect, setSelectedAgencyForInspect] = useState<Agency | null>(null);
  const [selectedVehicleForAudit, setSelectedVehicleForAudit] = useState<Vehicle | null>(null);
  
  // Custom interactive sliders inside Pricing
  const [baseMultiplier, setBaseMultiplier] = useState(1.0);
  const [agencyOnboardForm, setAgencyOnboardForm] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    city: 'Surat',
    taxId: '',
    fleetSize: '1-10',
    tier: 'Standard' as 'Standard' | 'Premium'
  });
  const [onboardSuccessMessage, setOnboardSuccessMessage] = useState('');

  // Selected telemetry vehicle for map view
  const [selectedMapVehicleId, setSelectedMapVehicleId] = useState<string>('');

  // Pricing rule creator states
  const [customRules, setCustomRules] = useState<PricingRule[]>([]);
  const [newRuleForm, setNewRuleForm] = useState({
    name: '',
    surgePercent: 20,
    applicableClass: 'All',
    notes: ''
  });

  // Calculate live values
  const getSimulatedTotalTurnover = () => {
    const baseVal = timeframe === 'week' ? 98450 : timeframe === 'year' ? 1284500 : 482900;
    return (baseVal + simulatedRevenueBoost).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  // Simulated Alert Injector
  const handleSimulateAlert = () => {
    const alertTitles = [
      "High API Latency on South-East CDN Gateways",
      "Surge Detected in Surat Airport Rental Requests",
      "Repetitive Unauthorized Auth attempt blocked",
      "Vehicle Plate GJ-05-AB-7890 reported low tire pressure",
      "Partner Skyline requested speedy listing verification node"
    ];
    const alertTypes: Array<'unauthorized' | 'purge' | 'lag' | 'info' | 'warning'> = [
      'lag', 'info', 'unauthorized', 'warning', 'info'
    ];
    const alertMessages = [
      "South-East regional content distribution nodes report response latency exceeding 340ms.",
      "Surat Central airport terminal is experiencing 180% normal volume. Recommending surge factor increase.",
      "Admin Center identified 4 consecutive failed token attempts from IP 185.120.44.89.",
      "Telemetry diagnostics report tire pressure below 25 PSI. Standby dispatcher alerted.",
      "Skyline Hub submitted document verification requests for 3 eco-hybrid vehicles."
    ];

    const idx = Math.floor(Math.random() * alertTitles.length);
    const newAlert: SystemAlert = {
      id: 'alert_' + Date.now(),
      type: alertTypes[idx],
      title: alertTitles[idx],
      message: alertMessages[idx],
      dateSubmitted: new Date().toLocaleTimeString()
    };

    setLocalSystemAlerts(prev => [newAlert, ...prev]);
  };

  const handleDismissAlert = (id: string) => {
    setLocalSystemAlerts(prev => prev.filter(al => al.id !== id));
  };

  const handleCreatePricingRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleForm.name) return;

    const rule: PricingRule = {
      id: 'rule_' + Date.now(),
      name: newRuleForm.name,
      surgePercent: Number(newRuleForm.surgePercent),
      startDate: '2026-06-25',
      endDate: '2026-07-15',
      applicableClass: newRuleForm.applicableClass,
      active: true,
      iconName: 'trending_up',
      notes: newRuleForm.notes || 'Custom temporary administrative override.'
    };

    setCustomRules(prev => [rule, ...prev]);
    setNewRuleForm({ name: '', surgePercent: 20, applicableClass: 'All', notes: '' });
    alert(`Administrative Policy Instantiated: Surge Rule "${rule.name}" with +${rule.surgePercent}% modifier added to execution cache.`);
  };

  // Simulate Partner onboarding
  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyOnboardForm.name || !agencyOnboardForm.taxId) {
      alert("Missing compliance entries. Please enter Company Name and Corporate Tax ID.");
      return;
    }
    const mockId = 'agency_' + Math.floor(Math.random() * 1000);
    const newAgency: Agency = {
      id: mockId,
      name: agencyOnboardForm.name,
      ownerName: agencyOnboardForm.ownerName || 'Unknown Registrar',
      email: agencyOnboardForm.email || 'corporate@partner.net',
      phone: agencyOnboardForm.phone || '+91 99999-55511',
      address: 'Industrial District Sector 4',
      city: agencyOnboardForm.city,
      zip: '395007',
      fleetSize: agencyOnboardForm.fleetSize,
      taxId: agencyOnboardForm.taxId,
      tier: agencyOnboardForm.tier,
      status: 'Pending'
    };

    // Push into system dynamically (simulated in UI)
    agencies.unshift(newAgency); // append directly to user prop list for instant visualization
    setOnboardSuccessMessage(`Onboarding Request Dispatched: ${agencyOnboardForm.name} entered as PENDING under registry reference ID ${mockId}. Check Partner Deck to review.`);
    setAgencyOnboardForm({
      name: '',
      ownerName: '',
      email: '',
      phone: '',
      city: 'Surat',
      taxId: '',
      fleetSize: '1-10',
      tier: 'Standard'
    });

    setTimeout(() => {
      setOnboardSuccessMessage('');
    }, 7000);
  };

  // Map Coordinates of standard hubs
  const getCoordinatesForTracker = () => {
    return {
      SURAT: { lat: '21.1702', lon: '72.8311', bbox: '72.78,21.14,72.88,21.20' },
      AHMEDABAD: { lat: '23.0225', lon: '72.5714', bbox: '72.52,22.99,72.62,23.05' },
      VADODARA: { lat: '22.3072', lon: '73.1812', bbox: '73.13,22.27,73.23,22.34' },
      RAJKOT: { lat: '22.3039', lon: '70.8022', bbox: '70.75,22.27,70.85,22.33' }
    }[selectedTrackingRegion] || { lat: '21.1702', lon: '72.8311', bbox: '72.78,21.14,72.88,21.20' };
  };

  const getTelemetryDataOfSelectedVehicle = () => {
    const defaultCar = vehicles.find(v => v.status === 'Rented') || vehicles[0];
    const targetCar = vehicles.find(v => v.id === selectedMapVehicleId) || defaultCar;
    return {
      car: targetCar,
      speed: Math.floor(Math.random() * 40) + 40,
      battery: Math.floor(Math.random() * 30) + 65,
      driver: targetCar ? (users.find(u => u.role === 'customer')?.name || 'Akash Patel') : 'Akash Patel',
      phone: targetCar ? (users.find(u => u.role === 'customer')?.phone || '+91 98250 12345') : '+91 98250 12345',
      latDelta: (Math.random() - 0.5) * 0.02,
      lonDelta: (Math.random() - 0.5) * 0.02,
    };
  };

  const currentMapTelemetry = getTelemetryDataOfSelectedVehicle();

  // Highlight and focus map on custom coordinate
  const getOsmMapUrl = () => {
    const loc = getCoordinatesForTracker();
    if (selectedMapVehicleId) {
      // Simulate slightly offset marker center to pin-point a specific moving vehicle coordinates
      const markerLat = parseFloat(loc.lat) + (currentMapTelemetry.latDelta || 0.005);
      const markerLon = parseFloat(loc.lon) + (currentMapTelemetry.lonDelta || -0.003);
      const bMinLat = markerLat - 0.02;
      const bMaxLat = markerLat + 0.02;
      const bMinLon = markerLon - 0.02;
      const bMaxLon = markerLon + 0.02;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${bMinLon},${bMinLat},${bMaxLon},${bMaxLat}&layer=mapnik&marker=${markerLat},${markerLon}`;
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=${loc.bbox}&layer=mapnik&marker=${loc.lat},${loc.lon}`;
  };

  const triggerPurgeCDN = () => {
    setIsPurgingCache(true);
    setTimeout(() => {
      setIsPurgingCache(false);
      alert("Executive Protocol Secured: Static assets and cache tables successfully purged distribution-wide across Cloudflare/CloudRun Edge nodes.");
    }, 1500);
  };

  const triggerReindexDb = () => {
    setIsReindexing(true);
    setTimeout(() => {
      setIsReindexing(false);
      alert("Database Synchronization Order Saved: PostgreSQL indexes reorganized. Database latency optimized back to default ~2.4ms.");
    }, 1800);
  };

  // Standard metrics helpers
  const totalRevenueBase = timeframe === 'week' ? 98450 : timeframe === 'year' ? 1284500 : 482900;
  const activeAlertsCount = localSystemAlerts.length;
  const pendingApprovalsCount = vehicles.filter(v => !v.approved).length;

  return (
    <div className="bg-slate-50/50 min-h-screen text-slate-900 font-sans flex flex-col lg:flex-row antialiased">
      
      {/* LEFT NAVIGATION SIDEBAR (Pivotal Admin Desk Control) */}
      <aside className="w-full lg:w-72 bg-gradient-to-b from-blue-700 via-blue-600 to-indigo-700 text-white flex flex-col border-r border-blue-800/40 shrink-0 select-none">
        {/* Admin Profile Section */}
        <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-black/20">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/25 shadow-md">
              <img 
                src={adminProfile.avatar} 
                alt={adminProfile.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-blue-600 animate-pulse"></span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm tracking-tight text-white">{adminProfile.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-blue-200" />
              <span className="text-[10px] font-black uppercase text-blue-100 tracking-wider font-bold">{adminProfile.role}</span>
            </div>
          </div>
        </div>

        {/* Navigation Sidebar Panel */}
        <div className="p-4 flex-grow space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-black tracking-widest text-blue-200/80 uppercase mb-2">Platform Control Deck</p>
          {[
            { id: 'dashboard', label: 'Overview Hub', icon: BarChart2, badge: null },
            { id: 'users', label: 'User Registry', icon: Users, badge: users.length },
            { id: 'agencies', label: 'Partner Agencies', icon: Building, badge: agencies.filter(a => a.status === 'Pending').length || null, badgeColor: 'bg-amber-500' },
            { id: 'listings', label: 'Listing Queue', icon: Car, badge: pendingApprovalsCount || null, badgeColor: 'bg-rose-500' },
            { id: 'bookings', label: 'Live GPS Monitor', icon: Map, badge: vehicles.filter(v => v.status === 'Rented').length || null, badgeColor: 'bg-indigo-500' },
            { id: 'pricing', label: 'Rates & Surge', icon: Sliders, badge: null },
            { id: 'analytics', label: 'Core Server SLA', icon: Activity, badge: null },
            { id: 'settings', label: 'Manage Account', icon: Settings, badge: null },
          ].map(tab => {
            const IconComponent = tab.icon;
            const isSelected = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onChangeView(tab.id);
                  // clear individual details variables when clicking navigations to return clean
                  setSelectedUserForInspect(null);
                  setSelectedAgencyForInspect(null);
                  setSelectedVehicleForAudit(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isSelected 
                    ? 'bg-white text-blue-700 shadow-md shadow-blue-900/40 font-extrabold' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${isSelected ? 'text-blue-700' : 'text-blue-200'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black leading-none text-white ${tab.badgeColor || 'bg-white/20'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Diagnostics Block */}
        <div className="p-4 m-4 bg-black/20 border border-white/10 rounded-2xl text-[11px] text-blue-100 space-y-2">
          <div className="flex justify-between items-center text-blue-200">
            <span className="font-mono text-[9px] tracking-widest text-blue-300 uppercase font-bold">Zone Center</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-300 font-bold uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> ONLINE
            </span>
          </div>
          <p className="font-semibold text-[11px] leading-relaxed text-white">Surat-Ahmedabad Central Node</p>
          <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] font-mono text-blue-300/70">
            <span>Svc Rel: v2.4.9</span>
            <span>Ping: 14ms</span>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT SCREEN */}
      <main className="flex-grow flex flex-col min-w-0 bg-slate-50/50">
        
        {/* EXECUTIVE HEADER STATUS PANEL */}
        <header className="bg-white border-b border-slate-200 px-6 sm:px-10 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-indigo-600 uppercase mb-1">
              <ShieldCheckIcon className="w-4 h-4 text-indigo-500" /> Administrative Command Node
            </div>
            <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-none">
              {{
                dashboard: 'Platform Hub Diagnostics',
                users: 'User Registry Database',
                agencies: 'Verified Partner Network',
                listings: 'Vehicle Listing Queue',
                bookings: 'Global Sat Map Tracker',
                pricing: 'Rate Multiplier Policies',
                analytics: 'Cloud Engine Infrastructure',
                settings: 'System Authentication Root'
              }[activeView] || 'Control System'}
            </h1>
          </div>

          {/* Quick Simulation Utility Box */}
          <div className="flex items-center gap-2.5 self-start sm:self-center">
            {activeView === 'dashboard' && (
              <div className="flex p-1 bg-slate-100 border rounded-xl gap-1">
                <button 
                  onClick={handleSimulateAlert}
                  className="bg-white hover:bg-slate-50 text-[10px] font-extrabold text-slate-700 px-3 py-2 rounded-lg border shadow-sm flex items-center gap-1.5 transition-all text-nowrap"
                  title="Simulate random field incidents"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Inject Alert
                </button>
                <button
                  onClick={() => {
                    const rnd = Math.floor(Math.random() * 8000) + 2000;
                    setSimulatedRevenueBoost(prev => prev + rnd);
                    alert(`Simulated Booking Influx: +$${rnd} generated in real-time rent entries!`);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-extrabold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all text-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" /> Bookings Revenue
                </button>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-mono text-slate-600 font-extrabold">2026-06-22 07:24 UTC</span>
            </div>
          </div>
        </header>

        {/* PRIMARY VIEW RENDERS */}
        <div className="p-6 sm:p-10 flex-grow overflow-y-auto">

          {/* ======================= OVERVIEW DASHBOARD ======================= */}
          {activeView === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Alert Ribbon for important alerts */}
              {localSystemAlerts.length > 0 && localSystemAlerts.some(a => ['warning', 'unauthorized'].includes(a.type)) && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-widest text-rose-800 uppercase">Attention Required</p>
                      <p className="text-xs text-rose-700 font-semibold mt-0.5">Critical anomalies or warnings have been registered inside the platforms logs.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onChangeView('settings')}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
                  >
                    View Audit Logs
                  </button>
                </div>
              )}

              {/* 1. Quad-Analytics Performance Indicators Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Metric 1: Adjusted Turnover Card */}
                <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group duration-300 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                      <DollarSign className="w-5.5 h-5.5" />
                    </div>
                    <div className="flex bg-slate-100 border p-0.5 rounded-lg text-[9px] font-black uppercase">
                      {(['week', 'month', 'year'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => setTimeframe(p)}
                          className={`px-2 py-1 rounded transition-all ${timeframe === p ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                          {p[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Tunover ({timeframe})</p>
                  <h3 className="font-black text-3xl text-slate-900">{getSimulatedTotalTurnover()}</h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
                    <TrendingUp className="w-3.5 h-3.5" /> +14.8% <span className="text-slate-400 font-semibold text-[10px]">from baseline</span>
                  </div>
                </div>

                {/* Metric 2: Users Registry */}
                <div 
                  onClick={() => onChangeView('users')}
                  className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all cursor-pointer group duration-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                      <Users className="w-5.5 h-5.5" />
                    </div>
                    <span className="text-[10px] font-black tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">Sync Live</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Registered Users</p>
                  <h3 className="font-black text-3xl text-slate-900 leading-tight">{(users.length * 12 + 15).toLocaleString()}</h3>
                  <p className="text-[10px] text-slate-500 mt-2 font-semibold">Active accounts globally across network</p>
                </div>

                {/* Metric 3: Onboarded Agencies */}
                <div 
                  onClick={() => onChangeView('agencies')}
                  className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all cursor-pointer group duration-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                      <Building className="w-5.5 h-5.5" />
                    </div>
                    <span className="text-[10px] font-black tracking-wider text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded uppercase">Verified</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Onboarded Partners</p>
                  <h3 className="font-black text-3xl text-slate-900 leading-none">{agencies.length} companies</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2 font-semibold">
                    <span>GST Accredited</span>
                  </div>
                </div>

                {/* Metric 4: Pending Listings */}
                <div 
                  onClick={() => onChangeView('listings')}
                  className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all cursor-pointer group duration-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                      <Car className="w-5.5 h-5.5 animate-pulse" />
                    </div>
                    {pendingApprovalsCount > 0 ? (
                      <span className="bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                        Audit Required
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                        Clear
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Listings</p>
                  <h3 className="font-black text-3xl text-slate-900 leading-none">{pendingApprovalsCount} units</h3>
                  <p className="text-[10px] text-slate-500 mt-2 font-semibold">Awaiting administrative compliance check</p>
                </div>

              </div>

              {/* 2. Advanced Performance Graphic & Alerts Feed Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Dynamic SVG Analytics Chart Breakdown (Weekly/Monthly/Yearly) */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-base uppercase tracking-widest">Global Fleet Health & Daily Revenue</h3>
                      <p className="text-xs text-slate-500 mt-1">Simulated daily booking distribution based on actual system reservation logs.</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl uppercase">
                        Scale Multiplier: {baseMultiplier.toFixed(1)}x
                      </span>
                    </div>
                  </div>

                  {/* SVG Bar chart with dynamic height transition */}
                  <div className="space-y-4">
                    <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-3 px-2 border-b pb-2 select-none">
                      {{
                        week: [420, 680, 510, 890, 720, 950, 1100],
                        month: [420, 480, 620, 590, 710, 840, 790, 910, 800, 920, 980, 1100],
                        year: [450, 520, 680, 630, 800, 890, 950, 910, 1050, 1100, 1150, 1280]
                      }[timeframe].map((val, idx) => {
                        const maxVal = timeframe === 'week' ? 1100 : timeframe === 'month' ? 1100 : 1280;
                        const pct = (val / maxVal) * 100;
                        return (
                          <div key={idx} className="flex-grow flex flex-col items-center group relative gap-1.5 h-full justify-end">
                            {/* Hover Tooltip tooltip */}
                            <div className="absolute bottom-full mb-2 bg-slate-950 text-white font-mono text-[9px] font-bold px-1.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-lg pointer-events-none">
                              ${(val * baseMultiplier).toLocaleString()}
                            </div>
                            {/* Bar segment container */}
                            <div className="w-full h-32 flex items-end relative">
                              <div 
                                className="w-full bg-gradient-to-t from-indigo-500 to-indigo-600 group-hover:to-indigo-400 rounded-t-lg transition-all duration-500"
                                style={{ height: `${pct}%` }}
                              ></div>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 font-mono shrink-0">
                              {timeframe === 'week' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx] : timeframe === 'month' ? `W${idx+1}` : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Diagnostic Legened Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      <div className="bg-slate-50 border rounded-xl p-3 text-center">
                        <span className="text-xl font-black text-indigo-600">94.2%</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Asset Utilization</p>
                      </div>
                      <div className="bg-slate-50 border rounded-xl p-3 text-center">
                        <span className="text-xl font-black text-emerald-600">62 Units</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Reserved Today</p>
                      </div>
                      <div className="bg-slate-50 border rounded-xl p-3 text-center">
                        <span className="text-xl font-black text-amber-600">14 Units</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Under Inspection</p>
                      </div>
                      <div className="bg-slate-50 border rounded-xl p-3 text-center">
                        <span className="text-xl font-black text-indigo-600">~2.4m</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Base Commits</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Global Activity notifications feed */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col h-full space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2">
                       Platform Alerts
                    </h3>
                    <span className="bg-indigo-100 text-indigo-700 font-black text-[9px] px-2.5 py-0.5 rounded-full font-mono">
                      {activeAlertsCount} Live
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 overflow-y-auto max-h-[290px] flex-grow pr-1 space-y-3">
                    {localSystemAlerts.length === 0 ? (
                      <div className="py-12 text-center space-y-2">
                        <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                        <p className="text-xs font-bold text-slate-500">System Fully Synched</p>
                        <p className="text-[10px] text-slate-400">Zero warnings registered in execution stack.</p>
                      </div>
                    ) : (
                      localSystemAlerts.map(al => (
                        <div key={al.id} className="pt-3 flex gap-3 text-xs group">
                          <span className="mt-0.5 shrink-0 text-amber-500">
                            {al.type === 'unauthorized' ? '🚨' : al.type === 'warning' ? '⚠️' : '🔔'}
                          </span>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-bold text-slate-900 truncate pr-2">{al.title}</p>
                              <button 
                                onClick={() => handleDismissAlert(al.id)}
                                className="text-[10px] text-slate-400 hover:text-indigo-600 font-medium px-1 inline-block shrink-0"
                              >
                                Done
                              </button>
                            </div>
                            <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{al.message}</p>
                            <span className="font-mono text-[9px] text-slate-400 block mt-1 uppercase font-bold">{al.dateSubmitted}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* 3. Operational Quick Actions Dashboard Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t font-semibold">
                <button 
                  onClick={() => onChangeView('users')}
                  className="p-6 bg-white border border-slate-200 hover:border-indigo-600 hover:shadow-lg rounded-2xl text-center shadow-sm flex flex-col items-center justify-center gap-3 group transition-all"
                >
                  <Users className="w-8 h-8 text-slate-500 group-hover:text-indigo-600 shrink-0 group-hover:-translate-y-1 transition-all" />
                  <div className="text-xs font-black text-slate-800 uppercase tracking-widest group-hover:text-indigo-600">Scan Registry</div>
                </button>
                <button 
                  onClick={() => onChangeView('agencies')}
                  className="p-6 bg-white border border-slate-200 hover:border-indigo-600 hover:shadow-lg rounded-2xl text-center shadow-sm flex flex-col items-center justify-center gap-3 group transition-all"
                >
                  <Building className="w-8 h-8 text-slate-500 group-hover:text-indigo-600 shrink-0 group-hover:-translate-y-1 transition-all" />
                  <div className="text-xs font-black text-slate-800 uppercase tracking-widest group-hover:text-indigo-600">Inspect Partners</div>
                </button>
                <button 
                  onClick={() => onChangeView('listings')}
                  className="p-6 bg-white border border-slate-200 hover:border-indigo-600 hover:shadow-lg rounded-2xl text-center shadow-sm flex flex-col items-center justify-center gap-3 group transition-all"
                >
                  <Car className="w-8 h-8 text-slate-500 group-hover:text-indigo-600 shrink-0 group-hover:-translate-y-1 transition-all" />
                  <div className="text-xs font-black text-slate-800 uppercase tracking-widest group-hover:text-indigo-600">Approval Desk</div>
                </button>
                <button 
                  onClick={() => onChangeView('bookings')}
                  className="p-6 bg-white border border-slate-200 hover:border-indigo-600 hover:shadow-lg rounded-2xl text-center shadow-sm flex flex-col items-center justify-center gap-3 group transition-all"
                >
                  <Map className="w-8 h-8 text-slate-500 group-hover:text-indigo-600 shrink-0 group-hover:-translate-y-1 transition-all" />
                  <div className="text-xs font-black text-slate-800 uppercase tracking-widest group-hover:text-indigo-600">Telemetry Sat</div>
                </button>
              </div>

            </div>
          )}


          {/* ======================= MANAGE USERS ======================= */}
          {activeView === 'users' && (
            <div className="space-y-8 animate-fade-in flex flex-col xl:flex-row gap-8 items-start">
              
              {/* Left Main Table Column */}
              <div className="flex-grow w-full space-y-6">
                
                {/* Search Header row */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
                  <div className="relative w-full max-w-md">
                    <input 
                      type="text" 
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Filter users by name, ID, or email..." 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none placeholder:text-slate-400 group focus:bg-white focus:ring-1 focus:ring-indigo-600"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={selectedUserRole}
                      onChange={(e) => setSelectedUserRole(e.target.value)}
                      className="bg-white border text-xs font-black uppercase tracking-wider py-2 px-3 rounded-xl focus:ring-1 focus:ring-indigo-600 outline-none cursor-pointer text-slate-600"
                    >
                      <option value="All Roles">All Roles</option>
                      <option value="admin">Administrators</option>
                      <option value="agency">Agency Owners</option>
                      <option value="customer">Customers</option>
                    </select>
                  </div>
                </div>

                {/* Users list table layout */}
                <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs sm:text-sm text-slate-700">
                      <thead className="bg-slate-50 border-b text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <tr>
                          <th className="px-6 py-4">User Details</th>
                          <th className="px-6 py-4">Email Contact</th>
                          <th className="px-6 py-4">Access Role Tag</th>
                          <th className="px-6 py-4">System Verification</th>
                          <th className="px-6 py-4 text-right">Settings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {users
                          .filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                          .filter(u => selectedUserRole === 'All Roles' || u.role === selectedUserRole)
                          .map(user => (
                            <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                    <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'} alt={user.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900 leading-none">{user.name}</p>
                                    <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase font-bold">UID: #{user.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-500">{user.email}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider border ${
                                  user.role === 'admin'
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                    : user.role === 'agency'
                                    ? 'bg-orange-50 border-orange-200 text-orange-700'
                                    : 'bg-blue-50 border-blue-200 text-blue-700'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Checked
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => setSelectedUserForInspect(user)}
                                  className="px-3.5 py-1.5 border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-extrabold text-indigo-700 transition-all uppercase tracking-wider"
                                >
                                  Inspect
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Sidebar Inspector Detail Panel */}
              <div className="w-full xl:w-96 bg-white border rounded-2xl p-6 shadow-sm shrink-0 space-y-6">
                <div className="pb-3 border-b">
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
                     Registry Inspector
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Select a user profile from table to edit settings node.</p>
                </div>

                {selectedUserForInspect ? (
                  <div className="space-y-6 animate-fade-in">
                    {/* Compact Hero Card */}
                    <div className="p-4 bg-slate-900 rounded-2xl text-white text-center space-y-3 relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-20 h-20 bg-indigo-500/20 rounded-full -mr-6 -mt-6"></div>
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 mx-auto bg-slate-800">
                        <img src={selectedUserForInspect.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black text-base">{selectedUserForInspect.name}</h4>
                        <span className="inline-block bg-indigo-600/65 border border-indigo-500/30 text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full mt-1">
                          Platform {selectedUserForInspect.role}
                        </span>
                      </div>
                    </div>

                    {/* Meta Fields form details */}
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">User Full Name</label>
                        <input
                          type="text"
                          value={selectedUserForInspect.name}
                          onChange={(e) => {
                            setSelectedUserForInspect({ ...selectedUserForInspect, name: e.target.value });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                        <input
                          type="email"
                          value={selectedUserForInspect.email}
                          onChange={(e) => {
                            setSelectedUserForInspect({ ...selectedUserForInspect, email: e.target.value });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={selectedUserForInspect.phone || ''}
                          onChange={(e) => {
                            setSelectedUserForInspect({ ...selectedUserForInspect, phone: e.target.value });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                          placeholder="+91 94220-40321"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">License Code</label>
                        <input
                          type="text"
                          value={selectedUserForInspect.license || ''}
                          onChange={(e) => {
                            setSelectedUserForInspect({ ...selectedUserForInspect, license: e.target.value });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                          placeholder="L-GJ-05-90122X"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Address Node</label>
                        <input
                          type="text"
                          value={selectedUserForInspect.address || ''}
                          onChange={(e) => {
                            setSelectedUserForInspect({ ...selectedUserForInspect, address: e.target.value });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                          placeholder="Katargam Main Rd, Surat"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Interactive User Role Swap</label>
                        <div className="grid grid-cols-3 gap-1">
                          {(['customer', 'agency', 'admin'] as const).map(role => (
                            <button
                              key={role}
                              onClick={() => {
                                selectedUserForInspect.role = role;
                                setSelectedUserForInspect({ ...selectedUserForInspect });
                              }}
                              className={`py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all border ${
                                selectedUserForInspect.role === role
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t space-y-2">
                        <button 
                          onClick={() => {
                            onUpdateUser?.(selectedUserForInspect);
                            alert(`Account Updated: Changes saved successfully for user UID #${selectedUserForInspect.id}.`);
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          Save User Changes
                        </button>

                        <button 
                          onClick={() => {
                            alert(`Account Suspended: Alexander Sterling override dispatched lock instruction regarding UID #${selectedUserForInspect.id}.`);
                            setSelectedUserForInspect(null);
                          }}
                          className="w-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                          <Ban className="w-4 h-4" /> Suspend Accounts Node
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-3">
                    <Info className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">No profile inspection requested</p>
                    <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto">Click "Inspect" on any table row to modify account specifications.</p>
                  </div>
                )}
              </div>

            </div>
          )}


          {/* ======================= MANAGE AGENCIES ======================= */}
          {activeView === 'agencies' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Onboard form / Info Banner drawer */}
              {onboardSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-semibold text-emerald-800 flex items-center gap-3 animate-fade-in shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{onboardSuccessMessage}</span>
                </div>
              )}

              {/* Onboard Agency Partner & Filter Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Main Table Column */}
                <div className="lg:col-span-8 space-y-6">
                  
                  <div className="bg-white border p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
                    <div className="relative w-full max-w-sm">
                      <input 
                        type="text" 
                        value={agencySearch}
                        onChange={(e) => setAgencySearch(e.target.value)}
                        placeholder="Search partner name or GST..." 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-xs outline-none placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-600"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={selectedAgencyTier}
                        onChange={(e) => setSelectedAgencyTier(e.target.value)}
                        className="bg-white border text-xs font-black uppercase tracking-wider py-2 px-3 rounded-xl focus:ring-1 focus:ring-indigo-600 outline-none cursor-pointer text-slate-500"
                      >
                        <option value="All">All Tiers</option>
                        <option value="Premium">Premium Partners</option>
                        <option value="Standard">Standard Partners</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs sm:text-sm text-slate-700">
                        <thead className="bg-slate-50 border-b text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <tr>
                            <th className="px-6 py-4">Corporate Agency</th>
                            <th className="px-6 py-4">Director</th>
                            <th className="px-6 py-4">Tax ID / GST</th>
                            <th className="px-6 py-4">Partnership</th>
                            <th className="px-6 py-4">Registry State</th>
                            <th className="px-6 py-4 text-right">Audit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {agencies
                            .filter(a => !agencySearch || a.name.toLowerCase().includes(agencySearch.toLowerCase()) || a.taxId.toLowerCase().includes(agencySearch.toLowerCase()))
                            .filter(a => selectedAgencyTier === 'All' || a.tier === selectedAgencyTier)
                            .map(agency => (
                              <tr key={agency.id} className="hover:bg-slate-50/40 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border flex items-center justify-center font-bold text-white shrink-0">
                                      {agency.avatar ? (
                                        <img src={agency.avatar} alt="Logo" className="w-full h-full object-cover" />
                                      ) : (
                                        agency.name.substring(0, 2).toUpperCase()
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-extrabold text-slate-900 leading-none">{agency.name}</p>
                                      <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase font-bold">GST-Reg: #{agency.zip || '395001'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-800">{agency.ownerName}</td>
                                <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{agency.taxId}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                    agency.tier === 'Premium'
                                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                                      : 'bg-slate-50 border-slate-200 text-slate-700'
                                  }`}>
                                    {agency.tier}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                                    agency.status === 'Verified'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : agency.status === 'Suspended'
                                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}>
                                    {agency.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => setSelectedAgencyForInspect(agency)}
                                    className="px-3.5 py-1.5 border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-extrabold text-indigo-700 transition-all uppercase tracking-wider"
                                  >
                                    KYC
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Right Registration & Direct Onboard Entry Panel */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Agency Compliance Inspector Drawer */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2">
                       KYC Compliance Audit
                    </h3>
                    <p className="text-xs text-slate-500">Inspect statutory registration documents of registered agencies.</p>
                    
                    {selectedAgencyForInspect ? (
                      <div className="space-y-4 border-t pt-3 animate-fade-in text-xs font-semibold">
                        <div className="p-3 bg-indigo-50/50 rounded-xl space-y-1">
                          <p className="text-slate-900 font-extrabold text-sm">{selectedAgencyForInspect.name}</p>
                          <p className="text-[11px] text-slate-500">Tax ID: {selectedAgencyForInspect.taxId}</p>
                          <p className="text-[11px] text-slate-500">Represented by: {selectedAgencyForInspect.ownerName}</p>
                        </div>

                        {/* Interactive Verification Checklist */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Compliance Checklist</p>
                          {[
                            { label: "Valid GST State Registration Certificate", checked: true },
                            { label: "Fleet Liability Insurance Coverage Vetted", checked: true },
                            { label: "Verified Corporate Local Office Address", checked: true },
                          ].map((chk, i) => (
                            <div key={i} className="flex items-center gap-2 text-slate-600 text-[11px]">
                              <input type="checkbox" defaultChecked={chk.checked} className="rounded border-slate-300Accent focus:ring-indigo-600" />
                              <span>{chk.label}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                          {selectedAgencyForInspect.status !== 'Verified' && (
                            <button
                              onClick={() => {
                                onApproveAgency(selectedAgencyForInspect.id, true);
                                selectedAgencyForInspect.status = 'Verified';
                                setSelectedAgencyForInspect({ ...selectedAgencyForInspect });
                                alert('Partner verified successfully under platform statutory standards.');
                              }}
                              className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase text-[10px] py-2.5 rounded-xl transition-all"
                            >
                              Approve Partner
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onApproveAgency(selectedAgencyForInspect.id, false);
                              selectedAgencyForInspect.status = 'Suspended';
                              setSelectedAgencyForInspect({ ...selectedAgencyForInspect });
                              alert('Partner profile suspended. Action logged in Root Settings.');
                            }}
                            className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white font-extrabold uppercase text-[10px] px-3.5 py-2.5 rounded-xl transition-all"
                            title="Suspend Partner"
                          >
                            Suspend
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-6 text-center">No partner selected. Click "KYC" to inspect legal credentials.</p>
                    )}
                  </div>

                  {/* Manual Administrative Onboard Form */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2">
                       Accredit Partner Node
                    </h3>
                    <p className="text-xs text-slate-500">Quickly setup and onboard trusted partner directories directly into the cache.</p>
                    
                    <form onSubmit={handleOnboardSubmit} className="space-y-3.5 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Company Trade Name</label>
                        <input 
                          type="text" 
                          required
                          value={agencyOnboardForm.name}
                          onChange={(e) => setAgencyOnboardForm({ ...agencyOnboardForm, name: e.target.value })}
                          placeholder="e.g. Skyline Mobility Services Ltd"
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:bg-white outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Registrar Director</label>
                          <input 
                            type="text" 
                            value={agencyOnboardForm.ownerName}
                            onChange={(e) => setAgencyOnboardForm({ ...agencyOnboardForm, ownerName: e.target.value })}
                            placeholder="Owner name"
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:bg-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Corporate Tax ID</label>
                          <input 
                            type="text" 
                            required
                            value={agencyOnboardForm.taxId}
                            onChange={(e) => setAgencyOnboardForm({ ...agencyOnboardForm, taxId: e.target.value })}
                            placeholder="GSTIN Number"
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:bg-white outline-none font-mono"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Corporate Tier</label>
                          <select 
                            value={agencyOnboardForm.tier}
                            onChange={(e) => setAgencyOnboardForm({ ...agencyOnboardForm, tier: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:bg-white outline-none font-semibold text-slate-600"
                          >
                            <option value="Standard">Standard Partner</option>
                            <option value="Premium">Premium Partner Badge</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Fleet Coverage Est</label>
                          <select 
                            value={agencyOnboardForm.fleetSize}
                            onChange={(e) => setAgencyOnboardForm({ ...agencyOnboardForm, fleetSize: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:bg-white outline-none font-semibold text-slate-600"
                          >
                            <option value="1-10">Small-Scale (1-10)</option>
                            <option value="11-50">Enterprise (11-50)</option>
                            <option value="50+">Gigafleet (50+)</option>
                          </select>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold uppercase py-2.5 rounded-xl transition-all shadow"
                      >
                        Dispatch Verification Request
                      </button>
                    </form>
                  </div>

                </div>

              </div>

            </div>
          )}


          {/* ======================= VEHICLE LISTING QUEUE ======================= */}
          {activeView === 'listings' && (
            <div className="space-y-8 animate-fade-in flex flex-col xl:flex-row gap-8 items-start">
              
              {/* Main List Table */}
              <div className="flex-grow w-full space-y-6">
                
                <div className="bg-white border rounded-2xl p-4 flex justify-between items-center shadow-sm">
                  <div className="relative w-full max-w-sm">
                    <input 
                      type="text" 
                      value={listingSearch}
                      onChange={(e) => setListingSearch(e.target.value)}
                      placeholder="Search model, plate, or brand..." 
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-indigo-600"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-500 uppercase">
                    Audit Queue Status: {vehicles.length} Units Vetted
                  </span>
                </div>

                <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs sm:text-sm text-slate-700">
                      <thead className="bg-slate-50 border-b text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <tr>
                          <th className="px-6 py-4">Vehicle Specs</th>
                          <th className="px-6 py-4">Company Owner</th>
                          <th className="px-6 py-4">General Rate Day</th>
                          <th className="px-6 py-4">Queue State</th>
                          <th className="px-6 py-4 text-right font-black">Audit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-semibold text-slate-700">
                        {vehicles
                          .filter(v => !listingSearch || v.name.toLowerCase().includes(listingSearch.toLowerCase()) || v.plateNo.toLowerCase().includes(listingSearch.toLowerCase()))
                          .map(veh => (
                            <tr key={veh.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-20 h-14 rounded-xl overflow-hidden border bg-slate-100 shrink-0 shadow-inner">
                                    <img src={veh.image} alt={veh.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900">{veh.name} <span className="text-xs font-semibold text-slate-400">({veh.year})</span></p>
                                    <p className="text-[10px] font-mono text-indigo-500 mt-1 uppercase font-bold">Plate: {veh.plateNo} &bull; {veh.fuelType}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-550">{veh.agencyName}</td>
                              <td className="px-6 py-4 text-indigo-600 font-extrabold text-sm">${veh.rateDay}/day</td>
                              <td className="px-6 py-4">
                                {veh.approved ? (
                                  <span className="inline-flex bg-emerald-50 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-widest">Active</span>
                                ) : (
                                  <span className="inline-flex bg-rose-50 text-rose-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-rose-200 uppercase tracking-widest animate-pulse">Pending Audit</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => setSelectedVehicleForAudit(veh)}
                                  className="px-3.5 py-1.5 border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-extrabold text-indigo-700 transition-all uppercase tracking-wider"
                                >
                                  Inspect Specs
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Specs Audit Right Panel */}
              <div className="w-full xl:w-96 bg-white border rounded-2xl p-6 shadow-sm shrink-0 space-y-6">
                <div className="pb-3 border-b">
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
                     Specs Auditor Desk
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Select a pending vehicle node to inspect registration specifics.</p>
                </div>

                {selectedVehicleForAudit ? (
                  <div className="space-y-6 animate-fade-in text-xs">
                    {/* Hero specs thumbnail */}
                    <div className="space-y-3">
                      <div className="w-full h-44 rounded-xl overflow-hidden border shadow-inner relative bg-slate-100">
                        <img src={selectedVehicleForAudit.image} alt={selectedVehicleForAudit.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Vehicle Name</label>
                          <input
                            type="text"
                            value={selectedVehicleForAudit.name}
                            onChange={(e) => {
                              setSelectedVehicleForAudit({ ...selectedVehicleForAudit, name: e.target.value });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Plate Number</label>
                            <input
                              type="text"
                              value={selectedVehicleForAudit.plateNo}
                              onChange={(e) => {
                                setSelectedVehicleForAudit({ ...selectedVehicleForAudit, plateNo: e.target.value });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Model Year</label>
                            <input
                              type="number"
                              value={selectedVehicleForAudit.year}
                              onChange={(e) => {
                                setSelectedVehicleForAudit({ ...selectedVehicleForAudit, year: parseInt(e.target.value) || 2024 });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Transmission</label>
                            <select
                              value={selectedVehicleForAudit.transmission}
                              onChange={(e) => {
                                setSelectedVehicleForAudit({ ...selectedVehicleForAudit, transmission: e.target.value });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                            >
                              <option value="Automatic">Automatic</option>
                              <option value="Manual">Manual</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Rate Day ($)</label>
                            <input
                              type="number"
                              value={selectedVehicleForAudit.rateDay}
                              onChange={(e) => {
                                setSelectedVehicleForAudit({ ...selectedVehicleForAudit, rateDay: parseInt(e.target.value) || 0 });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Vehicle Status</label>
                            <select
                              value={selectedVehicleForAudit.status}
                              onChange={(e) => {
                                setSelectedVehicleForAudit({ ...selectedVehicleForAudit, status: e.target.value as any });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                            >
                              <option value="Available">Available</option>
                              <option value="Rented">Rented</option>
                              <option value="Maintenance">Maintenance</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Vetted Audit Status</label>
                            <select
                              value={selectedVehicleForAudit.approved ? 'Approved' : 'Pending'}
                              onChange={(e) => {
                                setSelectedVehicleForAudit({ ...selectedVehicleForAudit, approved: e.target.value === 'Approved' });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white"
                            >
                              <option value="Approved">Approved</option>
                              <option value="Pending">Pending Audit</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Administrative Notes</label>
                          <textarea
                            value={selectedVehicleForAudit.notes || ''}
                            onChange={(e) => {
                              setSelectedVehicleForAudit({ ...selectedVehicleForAudit, notes: e.target.value });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-650 focus:bg-white h-16 resize-none"
                            placeholder="Administrative notes..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t space-y-2">
                      <button
                        onClick={() => {
                          onUpdateVehicle?.(selectedVehicleForAudit);
                          alert(`Specs Saved: Asset specs modified and saved successfully inside the system registry.`);
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold uppercase py-3 rounded-xl transition-all tracking-wider text-xs cursor-pointer shadow-sm flex items-center justify-center"
                      >
                        Save Specs Changes
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete this vehicle listing completely?`)) {
                            onDeleteVehicle?.(selectedVehicleForAudit.id);
                            setSelectedVehicleForAudit(null);
                            alert(`Specs Deleted: Vehicle listing purged completely from system database.`);
                          }
                        }}
                        className="w-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white font-extrabold uppercase py-3 rounded-xl transition-all tracking-wider text-xs cursor-pointer flex items-center justify-center"
                      >
                        Delete Vehicle Node
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-3">
                    <Info className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">No vehicle specs query loaded</p>
                    <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto">Click "Inspect Specs" on table row to verify permit documents.</p>
                  </div>
                )}
              </div>

            </div>
          )}


          {/* ======================= LIVE GPS MONITOR ======================= */}
          {activeView === 'bookings' && (
            <div className="space-y-8 animate-fade-in">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[650px] overflow-hidden items-stretch">
                
                {/* Live OSM Map Visualizer panel */}
                <div className="lg:col-span-8 bg-slate-900 rounded-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800 shadow-inner">
                  
                  {/* Embedded Iframe OSM matching location coordinates */}
                  <div className="absolute inset-0 z-0 opacity-40">
                    <iframe
                      title="Global Operational Tracker"
                      src={getOsmMapUrl()}
                      className="w-full h-full border-0 pointer-events-auto"
                      scrolling="no"
                    ></iframe>
                    {/* Deep ocean slate layout overlay */}
                    <div className="absolute inset-0 bg-slate-950/15 mix-blend-multiply pointer-events-none"></div>
                  </div>

                  {/* Status header overlay */}
                  <div className="p-4 bg-slate-950/85 backdrop-blur-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3 z-10 border-b border-slate-800/60">
                    <span className="flex items-center gap-2 text-xs font-black tracking-widest text-emerald-400">
                      <span className="inline-block w-2 bg-emerald-500 h-2 rounded-full animate-ping"></span>
                      ● ACTIVE TELEMETRY GPS LINK LOCKED
                    </span>
                    
                    {/* Segment switcher for GPS coordinates */}
                    <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-xl gap-1">
                      {['SURAT', 'AHMEDABAD', 'VADODARA', 'RAJKOT'].map(reg => (
                        <button
                          key={reg}
                          onClick={() => {
                            setSelectedTrackingRegion(reg);
                            setSelectedMapVehicleId(''); // clear individual focus to center region hub
                          }}
                          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                            selectedTrackingRegion === reg
                              ? 'bg-indigo-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {reg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Map Coordinate Marker indicator overlays */}
                  <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 z-10 text-center cursor-pointer select-none group">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 border-2 border-white flex items-center justify-center text-white shadow-lg animate-bounce">
                      <Car className="w-4 h-4" />
                    </div>
                    <span className="mt-1 bg-slate-950/95 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap block border border-slate-800/80">
                      Tesla Mode 3
                    </span>
                  </div>

                  <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 z-10 text-center cursor-pointer select-none">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-lg">
                      <Car className="w-4 h-4" />
                    </div>
                    <span className="mt-1 bg-slate-950/95 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap block border border-slate-800/80">
                      Audi e-tron
                    </span>
                  </div>

                  {/* Diagnostic status metrics banner */}
                  <div className="p-4 bg-slate-950/90 backdrop-blur-sm border-t border-slate-850 flex flex-wrap gap-4 sm:gap-6 text-[10px] text-slate-300 z-10 font-bold">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Cruising</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Standard Idle / Hub Standby</span>
                    <span className="flex items-center gap-1.5 animate-pulse"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Sensor Diagnostic Warn</span>
                    <span className="ml-auto text-[10px] font-mono text-indigo-300 uppercase tracking-wider">
                      Region limits: {selectedTrackingRegion} Tracker Synched
                    </span>
                  </div>

                </div>

                {/* Right telemetrics details drawer */}
                <div className="lg:col-span-4 bg-white border rounded-2xl flex flex-col h-full overflow-hidden shadow-sm">
                  <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-950 uppercase tracking-widest leading-none">
                      Rented Active Fleet
                    </h3>
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black font-mono px-2 py-0.5 rounded uppercase">
                      {vehicles.filter(v => v.status === 'Rented').length} tracked
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    {vehicles.filter(v => v.status === 'Rented').map(veh => {
                      const isFocusedOnMap = selectedMapVehicleId === veh.id;
                      return (
                        <div 
                          key={veh.id}
                          onClick={() => setSelectedMapVehicleId(veh.id)}
                          className={`p-4 border rounded-xl space-y-3 cursor-pointer transition-all ${
                            isFocusedOnMap 
                              ? 'bg-indigo-50/60 border-indigo-400/80 shadow-md ring-1 ring-indigo-300/30' 
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-extrabold text-slate-950 text-xs sm:text-sm">{veh.name}</h4>
                              <p className="text-[9px] font-mono text-slate-400 font-extrabold mt-0.5 uppercase tracking-wide">
                                Reg Plate: {veh.plateNo}
                              </p>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                              isFocusedOnMap ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-250 text-slate-600 border'
                            }`}>
                              {isFocusedOnMap ? 'Tracking On Map' : 'Select'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-500 pt-2 border-t">
                            <div>
                              <span className="text-[9px] font-extrabold uppercase text-slate-400 block tracking-wider">Estimated Battery</span>
                              <p className="text-slate-800 font-black mt-0.5">88% (Healthy)</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-extrabold uppercase text-slate-400 block tracking-wider">Velocity Node</span>
                              <p className="text-slate-800 font-extrabold mt-0.5">54 km/h GPS</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {vehicles.filter(v => v.status === 'Rented').length === 0 && (
                      <div className="py-20 text-center space-y-3">
                        <Radio className="w-10 h-10 text-slate-300 mx-auto animate-pulse" />
                        <p className="text-xs font-bold text-slate-400">Zero vehicles on transit</p>
                        <p className="text-[10px] text-slate-400">All registered vehicles are currently sitting idle in central hub garages.</p>
                      </div>
                    )}
                  </div>

                  {/* Active telemetries statistics footer */}
                  {selectedMapVehicleId && (
                    <div className="p-4 bg-slate-50 border-t text-xs font-semibold space-y-2 animate-fade-in">
                      <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Field Diagnostics Cache</p>
                      <div className="space-y-1 text-slate-600 leading-relaxed text-[11px]">
                        <p><span className="font-bold text-slate-800">Operator: </span> {currentMapTelemetry.driver}</p>
                        <p><span className="font-bold text-slate-800">Direct Comms: </span> {currentMapTelemetry.phone}</p>
                        <p><span className="font-bold text-slate-800">Server Latency: </span> 12.8ms ping-back</p>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}


          {/* ======================= RATE MANAGEMENT & SURGE ======================= */}
          {activeView === 'pricing' && (
            <div className="space-y-8 animate-fade-in">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Matrix Column */}
                <div className="lg:col-span-8 bg-white border rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 sm:p-5 border-b bg-slate-50 flex justify-between items-center">
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-base uppercase tracking-widest">Base Rate Matrices</h3>
                      <p className="text-xs text-slate-400 mt-1">Configure baseline daily costs across multiple vehicle tier classifications.</p>
                    </div>
                    {/* Interactive base rate adjustments simulation */}
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-slate-500">General multiplier:</span>
                      <input 
                        type="range"
                        min="0.8"
                        max="1.5"
                        step="0.1"
                        value={baseMultiplier}
                        onChange={(e) => {
                          setBaseMultiplier(Number(e.target.value));
                          setSimulatedRevenueBoost(prev => prev + 50); // slight interaction feedback
                        }}
                        className="w-24 accent-indigo-600 bg-slate-200 rounded-lg cursor-pointer h-2" 
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {pricingClasses.map(cls => (
                      <div key={cls.name} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/20 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-base">{cls.name}</span>
                            <span className="bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-100">
                              Base Level Account
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wide">Category segment: {cls.category}</p>
                        </div>
                        <div className="text-left sm:text-right font-semibold">
                          <p className="text-xl font-black text-indigo-600">${(cls.baseDay * baseMultiplier).toFixed(2)}/day</p>
                          <p className="text-xs text-slate-400 mt-0.5">Bulk Discounts: Weekly -{cls.rateWeekDiscount}% &bull; Monthly -{cls.rateMonthDiscount}% off</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Surge Overlay Toggles column */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Dynamic surge toggle widgets */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2">
                       Dynamic Surge Rules
                    </h3>
                    <p className="text-xs text-slate-500">Instantly activate seasonal rates or emergency surcharge modifiers.</p>
                    
                    <div className="space-y-3.5 pt-2">
                      {pricingRules.concat(customRules).map(rule => (
                        <div key={rule.id} className="p-4 border bg-slate-50 rounded-xl space-y-2 shadow-inner">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-extrabold text-slate-950 text-xs sm:text-sm leading-none">{rule.name}</h4>
                              <span className="text-[10px] font-black text-indigo-600 block mt-1.5 uppercase">
                                Modifier factor: +{rule.surgePercent}% Surge
                              </span>
                            </div>
                            
                            {/* Toggle switcher */}
                            <button 
                              onClick={() => {
                                onToggleRule(rule.id);
                                rule.active = !rule.active;
                                setCustomRules([...customRules]); // force list update trigger
                                alert(`Administrative Surge Calibration: Rule "${rule.name}" active status converted to: ${rule.active ? 'LIVE' : 'STANDBY'}.`);
                              }}
                              className={`w-11 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${
                                rule.active ? 'bg-indigo-600' : 'bg-slate-300'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                                rule.active ? 'translate-x-5' : 'translate-x-0'
                              }`}></div>
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{rule.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form to add custom Administrative Overrides */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm uppercase tracking-widest">
                       Add Surge Modifier
                    </h3>
                    
                    <form onSubmit={handleCreatePricingRule} className="space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 font-black">Rule Display Title</label>
                        <input 
                          type="text" 
                          required
                          value={newRuleForm.name}
                          onChange={(e) => setNewRuleForm({ ...newRuleForm, name: e.target.value })}
                          placeholder="e.g. Diwali Surge / Monsoon Surcharge"
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none focus:bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 font-black">Surcharge %</label>
                          <input 
                            type="number" 
                            min="5"
                            max="100"
                            value={newRuleForm.surgePercent}
                            onChange={(e) => setNewRuleForm({ ...newRuleForm, surgePercent: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none focus:bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 font-black">Applicable Unit</label>
                          <select 
                            value={newRuleForm.applicableClass}
                            onChange={(e) => setNewRuleForm({ ...newRuleForm, applicableClass: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none focus:bg-white text-slate-500 font-semibold"
                          >
                            <option value="All">All Tiers</option>
                            <option value="4-Wheeler">4-Wheelers Only</option>
                            <option value="2-Wheeler">2-Wheelers Only</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 font-black font-black">Administrative justification notes</label>
                        <textarea 
                          value={newRuleForm.notes}
                          onChange={(e) => setNewRuleForm({ ...newRuleForm, notes: e.target.value })}
                          placeholder="Why is this override required?"
                          rows={2}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none focus:bg-white resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold uppercase py-2.5 rounded-xl transition-all shadow"
                      >
                        Push Surcharge Protocol
                      </button>
                    </form>
                  </div>

                </div>

              </div>

            </div>
          )}


          {/* ======================= SYSTEM PERFORMANCE ======================= */}
          {activeView === 'analytics' && (
            <div className="space-y-8 animate-fade-in">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* CPU diagnostics console */}
                <div className="bg-white border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h3 className="font-extrabold text-slate-950 text-sm uppercase tracking-widest leading-none">
                      CPU Cores & Cluster Allocation
                    </h3>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-indigo-600 animate-pulse">
                      ● Active Load Balancing
                    </span>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-slate-500">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Central Cloud instance VM CPU (GCP cloud-run)</span>
                        <span className="font-mono font-bold text-slate-800">{simulatedServerLoad}% / 100% vCPU</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-700" 
                          style={{ width: `${simulatedServerLoad}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>PostgreSQL Active Transaction Connections</span>
                        <span className="font-mono font-bold text-slate-800">{simulatedDbConnections}% Pool Allocation</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-700" 
                          style={{ width: `${simulatedDbConnections}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Local Memory footprint allocation</span>
                        <span className="font-mono font-bold text-slate-800">1.28 GB / 4.0 GB Max Cache</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-400 h-full rounded-full" style={{ width: '32%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive server override triggers */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        const nextLoad = Math.floor(Math.random() * 35) + 30;
                        setSimulatedServerLoad(nextLoad);
                        const nextDb = Math.floor(Math.random() * 40) + 40;
                        setSimulatedDbConnections(nextDb);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] py-3 rounded-xl uppercase tracking-wider transition-all border shadow-xs"
                    >
                      Audit Cores Latency
                    </button>
                    <button
                      onClick={() => {
                        setSimulatedServerLoad(84);
                        setSimulatedDbConnections(91);
                        alert("Stress test protocol instantiated: Core load balancing simulated to +84%. System automatically scaling nodes... Standby.");
                        setTimeout(() => {
                          setSimulatedServerLoad(42);
                          setSimulatedDbConnections(55);
                        }, 5000);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] py-3 rounded-xl uppercase tracking-wider transition-all shadow"
                    >
                      Trigger Stress Test
                    </button>
                  </div>
                </div>

                {/* Database Synchronization Controls */}
                <div className="bg-white border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h3 className="font-extrabold text-slate-950 text-sm uppercase tracking-widest leading-none">
                      Database Maintenance Accel
                    </h3>
                    <span className="text-emerald-600 font-black text-[10px] uppercase font-mono bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                      SLA: 99.98% Healthy
                    </span>
                  </div>

                  <div className="space-y-4 text-xs leading-relaxed text-slate-500 font-semibold font-medium">
                    <p>Rentigo uses full cloud data synchronization backends. Administrative engineers can clear deadlocks, compress indices, and optimize read latency.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                        <span className="text-xs font-black text-slate-400 block uppercase tracking-widest">Average API Response</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-indigo-600">14.2ms</span>
                          <span className="text-[9px] text-slate-400 font-bold">Fastest</span>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                        <span className="text-xs font-black text-slate-400 block uppercase tracking-widest">Cache Pools hitrate</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-indigo-600">98.9%</span>
                          <span className="text-[9px] text-slate-400 font-bold">Redis-backed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <button
                      onClick={triggerPurgeCDN}
                      disabled={isPurgingCache}
                      className="bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white font-extrabold uppercase text-[10px] py-3 rounded-xl transition-all"
                    >
                      {isPurgingCache ? 'Purging Edge...' : 'Purge CDN Assets'}
                    </button>
                    <button
                      onClick={triggerReindexDb}
                      disabled={isReindexing}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold uppercase text-[10px] py-3 rounded-xl transition-all"
                    >
                      {isReindexing ? 'Optimizing Index...' : 'Re-index Database'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Graphical Network Latency distribution sparkline */}
              <div className="bg-white border rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm uppercase tracking-widest">
                  Live Gateway ping-back delay (last 16 queries)
                </h3>
                <div className="h-44 flex items-end justify-between gap-1.5 border-b pb-2 select-none">
                  {[12, 18, 14, 25, 34, 18, 11, 8, 14, 19, 21, 14, 12, 10, 16, 24].map((v, i) => (
                    <div 
                      key={i} 
                      className="flex-grow bg-indigo-500/85 hover:bg-indigo-600 rounded-t-lg transition-all"
                      style={{ height: `${v * 2.5}%` }}
                      title={`${v}ms latency query`}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  <span>14 hours ago</span>
                  <span>Average Response latency: 14.2ms</span>
                  <span>Live telemetry stream</span>
                </div>
              </div>

            </div>
          )}


          {/* ======================= ROOT SETTINGS PAGE ======================= */}
          {activeView === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-xs font-semibold">
              
              <form onSubmit={handleSaveAdminProfile} className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
                
                <header className="border-b pb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950 tracking-tight uppercase">Manage Account Settings</h2>
                    <p className="text-xs text-slate-400 mt-1 font-medium text-slate-500">Configure active administrative supervisor credentials, timezone boundaries, and secure authority tags.</p>
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md self-start sm:self-center cursor-pointer"
                  >
                    Save Options
                  </button>
                </header>

                {/* Administrative Officer Hero profile display */}
                <div className="p-5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl flex flex-col sm:flex-row items-center gap-6 text-white relative overflow-hidden shadow-md">
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mb-8"></div>
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/40 bg-slate-800 shrink-0 shadow-inner">
                    <img 
                      src={adminProfile.avatar} 
                      alt={adminProfile.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        // fallback if user enters invalid URL
                        (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDocLC2umusq4s4YgjAl0kgxz3AZ61mKVL2Fn8OTDQCF6t4B685w5vILkklaIJ-XhAFcR9LduU89QGFsIblMWm-a3QB4jFquDi9oh05jR63uwp1VP2Vxwn2ExxCjfLV9-IqeKwTK6xzfXSVqpENFCNaZiLH0SvTuKloKIG1_iYVifp5osAt2okIjTCfB62DY6s30ftjYWw8jfs5Tnw-x_1d8RZbnT3FEKhp-nqOq4RHwVugVVJiWQ7LAKYLQc8DC3GBtbl7YMGWpAyq';
                      }}
                    />
                  </div>
                  <div className="text-center sm:text-left space-y-1.5 z-10">
                    <h3 className="font-extrabold text-lg tracking-tight text-white">{adminProfile.name}</h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="inline-block bg-white/15 border border-white/20 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                        {adminProfile.role}
                      </span>
                      <span className="text-[10px] font-mono text-blue-100 uppercase font-black">Registered PIN: {adminProfile.pin}</span>
                    </div>
                  </div>
                </div>

                {/* Form fields parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Supervisor Full Name</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs"
                      value={adminProfile.name}
                      onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Administrative Position/Role</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs"
                      value={adminProfile.role}
                      onChange={(e) => setAdminProfile({ ...adminProfile, role: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Corporate Email Address</label>
                    <input 
                      type="email"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs"
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Contact Mobile Number</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs"
                      value={adminProfile.phone}
                      onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Registered Security Access PIN</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold font-mono outline-none text-xs"
                      value={adminProfile.pin}
                      onChange={(e) => setAdminProfile({ ...adminProfile, pin: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Admin Profile Avatar Image URL</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs"
                      value={adminProfile.avatar}
                      onChange={(e) => setAdminProfile({ ...adminProfile, avatar: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Primary Timezone Area</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-600 font-bold outline-none text-xs"
                      value={adminProfile.timezone}
                      onChange={(e) => setAdminProfile({ ...adminProfile, timezone: e.target.value })}
                    >
                      <option value="Coordinated Universal Time (UTC +00:00)">Coordinated Universal Time (UTC +00:00)</option>
                      <option value="New Delhi Standard Time (IST +05:30)">New Delhi Standard Time (IST +05:30)</option>
                      <option value="Pacific Standard Time (PST -08:00)">Pacific Standard Time (PST -08:00)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Accounting Currency Benchmark</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-600 font-bold outline-none text-xs"
                      value={adminProfile.currency}
                      onChange={(e) => setAdminProfile({ ...adminProfile, currency: e.target.value })}
                    >
                      <option value="USD ($) - US Dollar Segment">USD ($) - US Dollar Segment</option>
                      <option value="INR (₹) - Indian Rupee Segment">INR (₹) - Indian Rupee Segment</option>
                      <option value="EUR (€) - Euro Segment">EUR (€) - Euro Segment</option>
                    </select>
                  </div>
                </div>

                {/* Master Audit Tracer loglist */}
                <div className="pt-8 border-t space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm uppercase tracking-widest">
                      Administrative Policy Audit Trails
                    </h3>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Secured via SHA-256 Protocol</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { date: 'Jun 22, 2026 - 07:15', action: 'Approved GJ-12-AX-8910 Vehicle Listing', ip: '192.168.1.42', state: 'success' },
                      { date: 'Jun 21, 2026 - 18:34', action: 'Toggled Peaks High-Surge Season Pricing multipliers', ip: '192.168.1.42', state: 'success' },
                      { date: 'Jun 20, 2026 - 11:12', action: 'Secured Skyline Partner audit compliance pass', ip: '10.0.4.150', state: 'success' }
                    ].map((log, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-50 border rounded-xl p-4 text-xs font-semibold text-slate-500 shadow-inner">
                        <div className="space-y-1.5">
                          <p className="text-slate-800 font-extrabold leading-none">{log.action}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Timestamp: {log.date} &bull; Origin Terminal IP: {log.ip}</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {log.state}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </form>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}

// Simple custom component inline icons to ensure zero external dependency errors
function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
