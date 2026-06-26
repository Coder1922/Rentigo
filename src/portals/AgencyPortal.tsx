import React, { useState } from 'react';
import { 
  Building, Wrench, Shield, Key, Plus, FileText, CheckCircle, Search, 
  Trash2, Edit, Eye, Filter, Calendar, DollarSign, Check, X,
  BadgeAlert, ArrowUpRight, ArrowDownRight, Settings, PlusCircle, AlertTriangle
} from 'lucide-react';
import { Vehicle, Booking, Maintenance, Agency } from '../types';

interface AgencyPortalProps {
  activeView: string;
  onChangeView: (view: string) => void;
  vehicles: Vehicle[];
  bookings: Booking[];
  maintenanceList: Maintenance[];
  agencySession: Agency | null;
  onAddVehicle: (veh: Vehicle) => void;
  onUpdateVehicle: (veh: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  onUpdateBookingStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  onAddMaintenance: (maint: Maintenance) => void;
  onUpdateAgency: (agency: Agency) => void;
}

export default function AgencyPortal({
  activeView,
  onChangeView,
  vehicles,
  bookings,
  maintenanceList,
  agencySession,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onUpdateBookingStatus,
  onAddMaintenance,
  onUpdateAgency
}: AgencyPortalProps) {
  
  // Local fleet states
  const [editableVehicle, setEditableVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dashboard Metrics Year benchmark
  const activeAgencyVehicles = vehicles.filter(v => v.agencyId === (agencySession?.id || 'agency_1'));
  const activeAgencyRequests = bookings.filter(b => b.agencyId === (agencySession?.id || 'agency_1'));
  const activeAgencyMaintenance = maintenanceList.filter(m => {
    const veh = vehicles.find(v => v.id === m.vehicleId);
    return veh?.agencyId === (agencySession?.id || 'agency_1');
  });

  // Calculate totals
  const totalFleetSize = activeAgencyVehicles.length;
  const availableFleetCount = activeAgencyVehicles.filter(v => v.status === 'Available').length;
  const activeFleetCount = activeAgencyVehicles.filter(v => v.status === 'Rented').length;
  const maintenanceFleetCount = activeAgencyVehicles.filter(v => v.status === 'Maintenance').length;

  // Add/Edit Form states
  const [vehForm, setVehForm] = useState({
    name: '',
    plateNo: '',
    type: '4-Wheeler' as '2-Wheeler' | '4-Wheeler',
    fuelType: 'Electric' as 'Electric' | 'Hybrid' | 'Petrol' | 'Diesel',
    transmission: 'Automatic' as 'Automatic' | 'Manual',
    year: 2024,
    rateDay: 100,
    rateWeek: 600,
    rateMonth: 2200,
    status: 'Available' as 'Available' | 'Rented' | 'Maintenance',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC842OrLsEaVFsCsJWoRKHllgwFNZ_-E-ZsVWgoIDJvVnbclSU-OYa09o7S-aHW-xFpKXc-7moz_Y9kxMtpS03Ns0J1O0rHK7KYHfItVnHaBsH7AzDNWSe7OOMQLgSxDc-SKb54YYkfXjSKYTgX70hJLE80LZ9GDaQctgR3LE73iDj7hZD_7bUZsVL2uBK3JYF9eur73db_OJWduIWkso-rdz0gsi7w9-D-DRuRuO1czCvScKMWhLscWwIo4H1Pn2f3rz40uRIw-7XN',
    notes: ''
  });

  // Schedule Maintenance form state
  const [maintForm, setMaintForm] = useState({
    vehicleId: '',
    serviceType: 'Routine Oil Change',
    priority: 'routine' as 'routine' | 'medium' | 'critical',
    serviceDate: '2026-06-10',
    estimatedCost: 200,
    location: 'Rentigo Premium Service Zone 1',
    description: ''
  });

  // Settings
  const [profileForm, setProfileForm] = useState({
    name: agencySession?.name || 'Elite Motors',
    ownerName: agencySession?.ownerName || 'Jonathan Sterling',
    email: agencySession?.email || 'agency@rentigo.com',
    phone: agencySession?.phone || '+91 99999 00000',
    address: agencySession?.address || '782 Corporate Parkway, Suite 400',
    city: agencySession?.city || 'Surat',
    zip: agencySession?.zip || '395007',
    taxId: agencySession?.taxId || 'GSTIN-EM9022',
    avatar: agencySession?.avatar || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150'
  });

  // Watch agency session to auto-update profile parameters
  React.useEffect(() => {
    if (agencySession) {
      setProfileForm({
        name: agencySession.name,
        ownerName: agencySession.ownerName,
        email: agencySession.email,
        phone: agencySession.phone,
        address: agencySession.address,
        city: agencySession.city,
        zip: agencySession.zip,
        taxId: agencySession.taxId,
        avatar: agencySession.avatar || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150'
      });
    }
  }, [agencySession]);

  const handleEditInit = (veh: Vehicle) => {
    setEditableVehicle(veh);
    setVehForm({
      name: veh.name,
      plateNo: veh.plateNo,
      type: veh.type,
      fuelType: veh.fuelType,
      transmission: veh.transmission,
      year: veh.year,
      rateDay: veh.rateDay,
      rateWeek: veh.rateWeek,
      rateMonth: veh.rateMonth,
      status: veh.status,
      image: veh.image,
      notes: veh.notes || ''
    });
    onChangeView('edit_fleet');
  };

  const handleCreateInit = () => {
    setEditableVehicle(null);
    setVehForm({
      name: '',
      plateNo: '',
      type: '4-Wheeler',
      fuelType: 'Electric',
      transmission: 'Automatic',
      year: 2024,
      rateDay: 100,
      rateWeek: 600,
      rateMonth: 2200,
      status: 'Available',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC842OrLsEaVFsCsJWoRKHllgwFNZ_-E-ZsVWgoIDJvVnbclSU-OYa09o7S-aHW-xFpKXc-7moz_Y9kxMtpS03Ns0J1O0rHK7KYHfItVnHaBsH7AzDNWSe7OOMQLgSxDc-SKb54YYkfXjSKYTgX70hJLE80LZ9GDaQctgR3LE73iDj7hZD_7bUZsVL2uBK3JYF9eur73db_OJWduIWkso-rdz0gsi7w9-D-DRuRuO1czCvScKMWhLscWwIo4H1Pn2f3rz40uRIw-7XN',
      notes: ''
    });
    onChangeView('add_fleet');
  };

  const handleSubmitVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehForm.name || !vehForm.plateNo) {
      alert('Verification Exception: Model classification descriptions and plate numbers must not be empty.');
      return;
    }

    if (editableVehicle) {
      onUpdateVehicle({
        ...editableVehicle,
        ...vehForm
      });
      alert('Inventory synching successful! Asset updated in parent cloud network.');
    } else {
      const newVeh: Vehicle = {
        id: 'veh_' + Math.random().toString(36).substr(2, 9),
        ...vehForm,
        agencyId: agencySession?.id || 'agency_1',
        agencyName: agencySession?.name || 'Elite Motors',
        approved: true, // Auto-approved for verified demo agency partners
        maintenanceBlocked: false
      };
      onAddVehicle(newVeh);
      alert('Success: New asset committed safely inside your local agency inventory cluster!');
    }
    onChangeView('fleet');
  };

  const handleSubmitMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintForm.vehicleId) {
      alert('Verification Exception: You must select an active vehicle asset first.');
      return;
    }

    const targetVeh = vehicles.find(v => v.id === maintForm.vehicleId);
    if (!targetVeh) return;

    const newMaint: Maintenance = {
      id: 'maint_' + Math.random().toString(36).substr(2, 9),
      vehicleId: targetVeh.id,
      vehicleName: targetVeh.name,
      plateNo: targetVeh.plateNo,
      vehicleImage: targetVeh.image,
      serviceType: maintForm.serviceType,
      priority: maintForm.priority,
      serviceDate: maintForm.serviceDate,
      estimatedCost: Number(maintForm.estimatedCost),
      location: maintForm.location,
      description: maintForm.description,
      status: 'Scheduled'
    };

    onAddMaintenance(newMaint);
    
    // Also auto-update vehicle status to Maintenance
    onUpdateVehicle({
      ...targetVeh,
      status: 'Maintenance'
    });

    alert('Maintenance Allocation Success: Asset routed securely to direct workshop nodes.');
    onChangeView('maintenance');
  };

  const handleSaveAgencySettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (agencySession) {
      onUpdateAgency({
        ...agencySession,
        ...profileForm
      });
      alert('Agency Identity parameters saved successfully.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. PORTAL DASHBOARD */}
      {activeView === 'dashboard' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          
          <header className="border-b border-slate-200/60 pb-6">
            <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none">
              Agency Operations Node
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Real-time analytics, user booking pipelines, and partner fleet utilization matrices.
            </p>
          </header>

          {/* Staggered Metrics bar */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Requests</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold flex items-center">
                  Pending Action
                </span>
              </div>
              <div className="text-4xl font-extrabold text-slate-950">
                {activeAgencyRequests.filter(b => b.status === 'Pending').length}
              </div>
              <p className="text-xs text-slate-400 mt-4 font-medium pt-3 border-t border-slate-100">
                Out of {activeAgencyRequests.length} historical bookings
              </p>
            </div>

            <div className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Fleet</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold">
                  Optimal State
                </span>
              </div>
              <div className="text-4xl font-extrabold text-slate-950">
                {availableFleetCount} <span className="text-sm font-normal text-slate-400">/ {totalFleetSize} units</span>
              </div>
              <p className="text-xs text-slate-400 mt-4 font-medium pt-3 border-t border-slate-100">
                {activeFleetCount} currently on road contract
              </p>
            </div>

            <div className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Revenue (MTD)</span>
                <span className="text-emerald-600 font-extrabold text-xs flex items-center gap-0.5">
                  <ArrowUpRight className="w-4 h-4" /> +12.5%
                </span>
              </div>
              <div className="text-4xl font-extrabold text-slate-950">
                ${activeAgencyRequests.reduce((acc, b) => b.status === 'Approved' ? acc + b.totalAmount : acc, 0)}.00
              </div>
              <p className="text-xs text-slate-400 mt-4 font-medium pt-3 border-t border-slate-100">
                Based on approved transactions list
              </p>
            </div>

            <div className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maintenance Load</span>
                <span className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                  In Diagnostic Lanes
                </span>
              </div>
              <div className="text-4xl font-extrabold text-slate-950">
                {maintenanceFleetCount} <span className="text-sm font-normal text-slate-400">units</span>
              </div>
              <p className="text-xs text-slate-400 mt-4 font-medium pt-3 border-t border-slate-100">
                {activeAgencyMaintenance.filter(m => m.status === 'Overdue').length} currently Overdue priority cycles
              </p>
            </div>
          </section>

          {/* Staggered Visual charts & demand indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm">
              <h3 className="font-bold text-base text-slate-800 uppercase tracking-widest mb-6">Weekly Fleet Utilization Curves</h3>
              <div className="h-64 flex items-end justify-between gap-4 border-b pb-4 relative">
                {[60, 75, 85, 70, 92, 98, 80].map((val, idx) => (
                  <div key={idx} className="flex-grow flex flex-col items-center justify-end h-full group relative">
                    <div 
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-md transition-all duration-300"
                      style={{ height: `${val}%` }}
                    ></div>
                    <span className="absolute -top-8 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                      {val}% active
                    </span>
                    <span className="mt-2 text-xs font-semibold text-slate-400">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <h3 className="font-bold text-base text-slate-800 uppercase tracking-widest mb-6">Weight Matrix Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>4W (Four-Wheelers Luxury)</span>
                    <span>{totalFleetSize ? Math.round((activeAgencyVehicles.filter(v => v.type === '4-Wheeler').length / totalFleetSize) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${totalFleetSize ? (activeAgencyVehicles.filter(v => v.type === '4-Wheeler').length / totalFleetSize) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>2W (Compact Motos)</span>
                    <span>{totalFleetSize ? Math.round((activeAgencyVehicles.filter(v => v.type === '2-Wheeler').length / totalFleetSize) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${totalFleetSize ? (activeAgencyVehicles.filter(v => v.type === '2-Wheeler').length / totalFleetSize) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border p-4 rounded-xl text-xs text-slate-500 leading-relaxed font-semibold mt-4">
                💡 Advice: Market metrics report high weekend demands for 2W scooters. Route some units from 'Maintenance' loop to increase weekend profit margin.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. FLEET INVENTORY MANAGEMENT */}
      {activeView === 'fleet' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6">
            <div>
              <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none">Fleet Inventory</h1>
              <p className="text-sm text-slate-500 mt-2">Add new vehicles, edit pricing parameters, and track active lifecycle status indicators.</p>
            </div>
            <button 
              onClick={handleCreateInit}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow uppercase tracking-wider flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Add Vehicle Node
            </button>
          </div>

          {/* Interactive grid list of vehicles */}
          <section className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200/60 bg-slate-50/50 flex items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter key brand or plates..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border rounded-xl text-sm outline-none placeholder:text-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b text-xs font-bold uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Vehicle Specs</th>
                    <th className="px-6 py-4">Plate No.</th>
                    <th className="px-6 py-4">Hourly Rates Scale (D / W / M)</th>
                    <th className="px-6 py-4">Approved Status</th>
                    <th className="px-6 py-4">Lifecycle State</th>
                    <th className="px-6 py-4 text-right">Actions Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {activeAgencyVehicles
                    .filter(v => !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.plateNo.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(veh => (
                      <tr key={veh.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-lg bg-slate-100 border overflow-hidden shrink-0">
                              <img src={veh.image} alt={veh.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{veh.name}</p>
                              <p className="text-xs font-semibold text-slate-400 uppercase mt-0.5">{veh.type} &bull; {veh.fuelType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-xs text-slate-500">{veh.plateNo}</td>
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-blue-600">${veh.rateDay}</span> / <span className="text-slate-500">${veh.rateWeek}</span> / <span className="text-slate-500">${veh.rateMonth}</span>
                        </td>
                        <td className="px-6 py-4">
                          {veh.approved ? (
                            <span className="inline-flex bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-widest">Approved</span>
                          ) : (
                            <span className="inline-flex bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-widest">Pending Review</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                            veh.status === 'Available'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : veh.status === 'Rented'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              veh.status === 'Available' ? 'bg-blue-500' : veh.status === 'Rented' ? 'bg-orange-500' : 'bg-red-500'
                            }`}></span>
                            {veh.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => handleEditInit(veh)}
                              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                              title="Modify Inventory Specs"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm(`Warning: Are you sure you want to delete ${veh.name} from your agency registry?`)) {
                                  onDeleteVehicle(veh.id);
                                }
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600 transition-colors"
                              title="Purge Vehicle Node"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Showing {activeAgencyVehicles.length} of {activeAgencyVehicles.length} records in active dashboard sync</span>
            </div>
          </section>
        </div>
      )}

      {/* 3. ADD OR EDIT FLEET VEHICLE FORM */}
      {(activeView === 'add_fleet' || activeView === 'edit_fleet') && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            <header className="bg-slate-950 text-white p-6 sm:p-8 flex items-center gap-4">
              <div className="p-3 bg-slate-800 rounded-xl text-orange-500 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {editableVehicle ? `Modify Inventory Spec: ${editableVehicle.name}` : 'Register New Fleet Asset'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure technical variables and hourly rates matrices dynamically.
                </p>
              </div>
            </header>

            <form onSubmit={handleSubmitVehicle} className="p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Brand Model Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Brand &amp; Model Title</label>
                  <input 
                    type="text"
                    value={vehForm.name}
                    onChange={(e) => setVehForm({ ...vehForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
                    placeholder="e.g. Tesla Model 3"
                    required
                  />
                </div>

                {/* Plate Number Registration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plate Tag Number</label>
                  <input 
                    type="text"
                    value={vehForm.plateNo}
                    onChange={(e) => setVehForm({ ...vehForm, plateNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white uppercase font-mono tracking-wider font-bold"
                    placeholder="e.g. SUR-11-AA-9999"
                    required
                  />
                </div>

                {/* Vehicle Class Portfolio */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vehicle Class Category</label>
                  <select 
                    value={vehForm.type}
                    onChange={(e) => setVehForm({ ...vehForm, type: e.target.value as '2-Wheeler' | '4-Wheeler' })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 focus:bg-white outline-none"
                  >
                    <option value="4-Wheeler">4-Wheeler Portfolio</option>
                    <option value="2-Wheeler">2-Wheeler Portfolio</option>
                  </select>
                </div>

                {/* Powertrain Class */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Propulsion Powertrain</label>
                  <select 
                    value={vehForm.fuelType}
                    onChange={(e) => setVehForm({ ...vehForm, fuelType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 focus:bg-white outline-none"
                  >
                    <option value="Electric">Electric Node (EV)</option>
                    <option value="Hybrid">Hybrid System</option>
                    <option value="Petrol">Petrol Combustion</option>
                    <option value="Diesel">Diesel Combustion</option>
                  </select>
                </div>

                {/* Transmission Class */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transmission</label>
                  <select 
                    value={vehForm.transmission}
                    onChange={(e) => setVehForm({ ...vehForm, transmission: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 focus:bg-white outline-none"
                  >
                    <option value="Automatic">Automatic Transmission</option>
                    <option value="Manual">Manual Gear Box</option>
                  </select>
                </div>

                {/* Model Year */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Model Release Year</label>
                  <input 
                    type="number"
                    value={vehForm.year}
                    onChange={(e) => setVehForm({...vehForm, year: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500"
                    min={2018}
                    max={2026}
                    required
                  />
                </div>

                {/* Cost Matrix Plans */}
                <div className="col-span-1 sm:col-span-2 border-y border-slate-100 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Daily rate ($)</label>
                    <input 
                      type="number"
                      value={vehForm.rateDay}
                      onChange={(e) => setVehForm({...vehForm, rateDay: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 font-bold"
                      min={10}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Weekly rate ($)</label>
                    <input 
                      type="number"
                      value={vehForm.rateWeek}
                      onChange={(e) => setVehForm({...vehForm, rateWeek: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 font-bold"
                      min={50}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Monthly rate ($)</label>
                    <input 
                      type="number"
                      value={vehForm.rateMonth}
                      onChange={(e) => setVehForm({...vehForm, rateMonth: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 font-bold"
                      min={150}
                      required
                    />
                  </div>

                </div>

                {/* Initial Status lifecycle state */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Lifecycle State</label>
                  <select 
                    value={vehForm.status}
                    onChange={(e) => setVehForm({...vehForm, status: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 outline-none"
                  >
                    <option value="Available">Available for contract hold</option>
                    <option value="Rented">Active Contract Hold (Rented)</option>
                    <option value="Maintenance">Diagnostic Lanes (Maintenance)</option>
                  </select>
                </div>

                {/* Dummy picture URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Image Content Vector Link</label>
                  <input 
                    type="text"
                    value={vehForm.image}
                    onChange={(e) => setVehForm({...vehForm, image: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 text-slate-500 text-xs"
                    required
                  />
                </div>

                {/* Detailed descriptions */}
                <div className="space-y-1 col-span-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Asset Diagnostics Description</label>
                  <textarea 
                    value={vehForm.notes}
                    onChange={(e) => setVehForm({...vehForm, notes: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 outline-none"
                    placeholder="e.g. Vetted leather trims, active firmware sync."
                  />
                </div>

              </div>

              {/* Action columns click buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-6 border-t">
                <button 
                  type="button" 
                  onClick={() => onChangeView('fleet')}
                  className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow uppercase tracking-wider"
                >
                  Committed Node Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. CLIENT BOOKING REQUESTS PIPELINE */}
      {activeView === 'requests' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          
          <header className="border-b border-slate-200/60 pb-6">
            <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none text-slate-800">Booking Requests Queue</h1>
            <p className="text-sm text-slate-500 mt-2">Oversee client listings allocations. Confirm schedules, verify pricing models, and trigger verification runs.</p>
          </header>

          {/* Active lists */}
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto font-medium">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b text-xs font-bold uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Client Details</th>
                    <th className="px-6 py-4">Target Vehicle Asset</th>
                    <th className="px-6 py-4">Duration Range</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Verification Indicator</th>
                    <th className="px-6 py-4 text-right">Actions Matrix Panel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {activeAgencyRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No active booking requests have been logged in this agency node yet.
                      </td>
                    </tr>
                  ) : (
                    activeAgencyRequests.map(book => (
                      <tr key={book.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                              <img src={book.customerAvatar} alt="Customer" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-none">{book.customerName}</p>
                              <p className="text-xs font-mono text-slate-400 mt-1">{book.customerPhone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-9 rounded bg-slate-100 border overflow-hidden shrink-0">
                              <img src={book.vehicleImage} alt={book.vehicleName} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-slate-800">{book.vehicleName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{book.startDate} to {book.endDate}</p>
                          <p className="text-xs text-slate-400 mt-0.5">&bull; {book.durationDays} Days contract</p>
                        </td>
                        <td className="px-6 py-4 font-black text-blue-600">
                          ${book.totalAmount}.00
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                            book.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : book.status === 'Rejected'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              book.status === 'Approved' ? 'bg-emerald-500' : book.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'
                            }`}></span>
                            {book.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {book.status === 'Pending' ? (
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => {
                                  onUpdateBookingStatus(book.id, 'Approved');
                                  alert(`Booking status parameter successfully modified to 'Approved'.`);
                                }}
                                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center font-bold"
                                title="Approve Request"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  onUpdateBookingStatus(book.id, 'Rejected');
                                  alert(`Booking status parameter successfully modified to 'Rejected'.`);
                                }}
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center font-bold"
                                title="Reject Request"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Committed state</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 5. DIAGNOSTICS & MAINTENANCE HUB */}
      {activeView === 'maintenance' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6">
            <div>
              <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none text-slate-800">Maintenance Diagnostics Lane</h1>
              <p className="text-sm text-slate-500 mt-2">Track diagnostic health scores or schedule a vehicle check-in session context.</p>
            </div>
            <button 
              onClick={() => {
                setMaintForm({
                  vehicleId: '',
                  serviceType: 'Routine Oil Change',
                  priority: 'routine',
                  serviceDate: '2026-06-10',
                  estimatedCost: 200,
                  location: 'Rentigo Premium Service Zone 1',
                  description: ''
                });
                onChangeView('schedule_maintenance');
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow uppercase tracking-wider flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4" /> Schedule Maintenance Run
            </button>
          </div>

          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto font-medium">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b text-xs font-bold uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Vehicle Tags</th>
                    <th className="px-6 py-4">Model Specification</th>
                    <th className="px-6 py-4">Operations Type</th>
                    <th className="px-6 py-4">Pipeline Status</th>
                    <th className="px-6 py-4">Scheduled Date</th>
                    <th className="px-6 py-4 text-right">Actions Matrix Panel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {activeAgencyMaintenance.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No active maintenance cycles scheduled.
                      </td>
                    </tr>
                  ) : (
                    activeAgencyMaintenance.map(maint => (
                      <tr key={maint.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-10 rounded overflow-hidden bg-slate-100 border shrink-0">
                              <img src={maint.vehicleImage} alt={maint.vehicleName} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-mono font-bold text-xs text-slate-500">{maint.plateNo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">{maint.vehicleName}</td>
                        <td className="px-6 py-4 text-slate-500">{maint.serviceType}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                            maint.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : maint.status === 'Overdue'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              maint.status === 'In Progress' ? 'bg-blue-500' : maint.status === 'Overdue' ? 'bg-red-500' : 'bg-slate-500'
                            }`}></span>
                            {maint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">{maint.serviceDate}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => alert(`Diagnostics Log Detail: Verified estimated service cost at $${maint.estimatedCost}. Location: ${maint.location}. Notes: ${maint.description || 'No custom notes.'}`)}
                            className="text-blue-600 font-bold text-xs hover:underline"
                          >
                            View Log Info
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 6. SCHEDULE FORWARD MAINTENANCE SUBMISSION FORM */}
      {activeView === 'schedule_maintenance' && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            <header className="bg-slate-950 text-white p-6 sm:p-8 flex items-center gap-4">
              <div className="p-3 bg-slate-800 rounded-xl text-orange-500 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Schedule Maintenance Run</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Route an inventory vehicle directly to standard diagnostic lanes.
                </p>
              </div>
            </header>

            <form onSubmit={handleSubmitMaintenance} className="p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Select Vehicle */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Target Fleet Vehicle</label>
                  <select 
                    value={maintForm.vehicleId}
                    onChange={(e) => setMaintForm({ ...maintForm, vehicleId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 outline-none"
                    required
                  >
                    <option value="" disabled>Choose a vehicle from your dashboard...</option>
                    {activeAgencyVehicles.filter(v => v.status === 'Available').map(veh => (
                      <option key={veh.id} value={veh.id}>
                        {veh.name} ({veh.plateNo}) &bull; Available
                      </option>
                    ))}
                  </select>
                </div>

                {/* Operations Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Service Operations Type</label>
                  <select 
                    value={maintForm.serviceType}
                    onChange={(e) => setMaintForm({ ...maintForm, serviceType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 outline-none"
                  >
                    <option value="Routine Oil Change">Fluid Replacement / Oil Change</option>
                    <option value="Annual Structural Inspection">Routine Annual Inspection</option>
                    <option value="Brake Calibration">Brakes Hardware Calibration</option>
                    <option value="Tire Rotation">Tires Alignment &amp; Rotation</option>
                    <option value="Battery Diagnostics Log">EV Battery Diagnostics Sync</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Urgency Classification</label>
                  <select 
                    value={maintForm.priority}
                    onChange={(e) => setMaintForm({ ...maintForm, priority: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 outline-none"
                  >
                    <option value="routine">Routine (Scheduled Cycle)</option>
                    <option value="medium">Medium (Advisory Warning State)</option>
                    <option value="critical">Critical (Immediate Diagnostic Handover)</option>
                  </select>
                </div>

                {/* Service Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Check-In Date</label>
                  <input 
                    type="date"
                    value={maintForm.serviceDate}
                    onChange={(e) => setMaintForm({ ...maintForm, serviceDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500"
                    required
                  />
                </div>

                {/* Estimate Cost */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estimated Cost Allocation ($)</label>
                  <input 
                    type="number"
                    value={maintForm.estimatedCost}
                    onChange={(e) => setMaintForm({ ...maintForm, estimatedCost: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500"
                    min={0}
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assigned Workshop Garage Center</label>
                  <input 
                    type="text"
                    value={maintForm.location}
                    onChange={(e) => setMaintForm({ ...maintForm, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500"
                    placeholder="e.g. Rentigo Authorized Hub IV"
                    required
                  />
                </div>

                {/* Diagnostics message list */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detailed Diagnostic Instructions</label>
                  <textarea 
                    value={maintForm.description}
                    onChange={(e) => setMaintForm({ ...maintForm, description: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm rounded-xl focus:ring-1 focus:ring-orange-500 outline-none"
                    placeholder="Provide specifics of warning states or error log codes..."
                  />
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-6 border-t">
                <button 
                  type="button" 
                  onClick={() => onChangeView('maintenance')}
                  className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow uppercase tracking-wider"
                >
                  Commit Run Schedule
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 7. SETTINGS PAGE */}
      {activeView === 'settings' && (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in text-xs font-semibold">
          
          <form onSubmit={handleSaveAgencySettings} className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
            
            <header className="border-b pb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950 tracking-tight uppercase">Manage Partner Settings</h2>
                <p className="text-xs text-slate-400 mt-1 font-medium text-slate-500">Configure corporate brand marks, partner identity details, and regional taxation parameters.</p>
              </div>
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md self-start sm:self-center cursor-pointer"
              >
                Save Options
              </button>
            </header>

            {/* Corporate Brand Card */}
            <div className="p-5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-2xl flex flex-col sm:flex-row items-center gap-6 text-white relative overflow-hidden shadow-md">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mb-8"></div>
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/40 bg-slate-800 shrink-0 shadow-inner">
                <img 
                  src={profileForm.avatar} 
                  alt={profileForm.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150';
                  }}
                />
              </div>
              <div className="text-center sm:text-left space-y-1.5 z-10">
                <h3 className="font-extrabold text-lg tracking-tight text-white">{profileForm.name}</h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-block bg-white/15 border border-white/20 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    Verified Partner Network
                  </span>
                  <span className="text-[10px] font-mono text-orange-100 uppercase font-black">Tax ID: {profileForm.taxId}</span>
                </div>
              </div>
            </div>

            {/* Form Fields parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5 font-semibold">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Agency Corporate Title</label>
                <input 
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-slate-0 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-1.5 font-semibold">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Registered Owner Name</label>
                <input 
                  type="text"
                  value={profileForm.ownerName}
                  onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                  className="w-full bg-slate-0 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-1.5 font-semibold">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Business Communication Email</label>
                <input 
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-slate-0 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-1.5 font-semibold">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Contact Number</label>
                <input 
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-slate-0 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-1.5 font-semibold sm:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Headquarters Address</label>
                <input 
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full bg-slate-0 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-1.5 font-semibold">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">City Location</label>
                <input 
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="w-full bg-slate-0 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-1.5 font-semibold">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Zip Code</label>
                <input 
                  type="text"
                  value={profileForm.zip}
                  onChange={(e) => setProfileForm({ ...profileForm, zip: e.target.value })}
                  className="w-full bg-slate-0 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-1.5 font-semibold">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Corporate GSTIN / Tax ID</label>
                <input 
                  type="text"
                  value={profileForm.taxId}
                  onChange={(e) => setProfileForm({ ...profileForm, taxId: e.target.value })}
                  className="w-full bg-slate-0 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none font-mono text-xs focus:border-orange-500"
                  required
                />
              </div>

              <div className="space-y-1.5 font-semibold">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Agency Logo / Mark URL</label>
                <input 
                  type="text"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  className="w-full bg-slate-0 border border-slate-200 px-4 py-3 rounded-xl focus:bg-white text-slate-800 font-semibold outline-none text-xs focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button 
                type="submit" 
                className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Portal Parameters
              </button>
            </div>
          </form>

          {/* Audit Logs for Agency */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm uppercase tracking-widest">
                Partner Operational Audit Records
              </h3>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Secured via SHA-256 Protocol</span>
            </div>

            <div className="space-y-2.5">
              {[
                { date: 'Jun 22, 2026 - 06:12', action: 'Synchronized direct fleet list count of assets', ip: '127.0.0.1', state: 'success' },
                { date: 'Jun 21, 2026 - 15:45', action: 'Authorized maintenance status on diagnostic lanes for unit', ip: '192.168.2.14', state: 'success' },
                { date: 'Jun 20, 2026 - 19:30', action: 'Commited tax parameters and localized currency segment', ip: '192.168.2.14', state: 'success' }
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

    </div>
  );
}
