import { useState, useEffect } from 'react';
import { 
  User, Vehicle, Booking, Maintenance, Agency, PricingClass, PricingRule, SystemAlert 
} from './types';
import { 
  INITIAL_USERS, INITIAL_VEHICLES, INITIAL_BOOKINGS, INITIAL_MAINTENANCE, 
  INITIAL_AGENCIES, INITIAL_PRICING_CLASSES, INITIAL_PRICING_RULES, INITIAL_ALERTS 
} from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import CustomerPortal from './portals/CustomerPortal';
import AgencyPortal from './portals/AgencyPortal';
import AdminPortal from './portals/AdminPortal';
import AuthPortal from './portals/AuthPortal';

export default function App() {
  // Master Lists States with Local Storage Lazy Initialization
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('rentigo_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('rentigo_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('rentigo_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [agencies, setAgencies] = useState<Agency[]>(() => {
    const saved = localStorage.getItem('rentigo_agencies');
    return saved ? JSON.parse(saved) : INITIAL_AGENCIES;
  });

  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>(() => {
    const saved = localStorage.getItem('rentigo_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [pricingClasses, setPricingClasses] = useState<PricingClass[]>(() => {
    const saved = localStorage.getItem('rentigo_pricing_classes');
    return saved ? JSON.parse(saved) : INITIAL_PRICING_CLASSES;
  });

  const [pricingRules, setPricingRules] = useState<PricingRule[]>(() => {
    const saved = localStorage.getItem('rentigo_pricing_rules');
    return saved ? JSON.parse(saved) : INITIAL_PRICING_RULES;
  });

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>(() => {
    const saved = localStorage.getItem('rentigo_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // Current session contexts
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rentigo_current_user');
    const isLoggedOut = localStorage.getItem('rentigo_customer_logged_out') === 'true';
    if (isLoggedOut) return null;
    return saved ? JSON.parse(saved) : (INITIAL_USERS.find(u => u.id === 'user_5') || INITIAL_USERS[0]);
  });

  const [agencySession, setAgencySession] = useState<Agency | null>(() => {
    const saved = localStorage.getItem('rentigo_agency_session');
    const isLoggedOut = localStorage.getItem('rentigo_agency_logged_out') === 'true';
    if (isLoggedOut) return null;
    return saved ? JSON.parse(saved) : (INITIAL_AGENCIES.find(a => a.id === 'agency_1') || INITIAL_AGENCIES[0]);
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const isLoggedOut = localStorage.getItem('rentigo_admin_logged_out') === 'true';
    return !isLoggedOut;
  });

  const [currentRole, setCurrentRole] = useState<'customer' | 'agency' | 'admin'>(() => {
    const saved = localStorage.getItem('rentigo_role');
    return (saved as any) || 'customer';
  });

  const [activeView, setActiveView] = useState<string>(() => {
    const savedRole = localStorage.getItem('rentigo_role') || 'customer';
    return savedRole === 'customer' ? 'home' : 'dashboard';
  });

  // Keep Local Storage Synched
  useEffect(() => {
    localStorage.setItem('rentigo_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('rentigo_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('rentigo_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('rentigo_agencies', JSON.stringify(agencies));
  }, [agencies]);

  useEffect(() => {
    localStorage.setItem('rentigo_maintenance', JSON.stringify(maintenanceList));
  }, [maintenanceList]);

  useEffect(() => {
    localStorage.setItem('rentigo_pricing_classes', JSON.stringify(pricingClasses));
  }, [pricingClasses]);

  useEffect(() => {
    localStorage.setItem('rentigo_pricing_rules', JSON.stringify(pricingRules));
  }, [pricingRules]);

  useEffect(() => {
    localStorage.setItem('rentigo_alerts', JSON.stringify(systemAlerts));
  }, [systemAlerts]);

  // Handle active role swap parameters
  const handleChangeRole = (role: 'customer' | 'agency' | 'admin') => {
    setCurrentRole(role);
    localStorage.setItem('rentigo_role', role);
    setActiveView(role === 'customer' ? 'home' : 'dashboard');
  };

  const handleLogout = () => {
    if (currentRole === 'customer') {
      setCurrentUser(null);
      localStorage.setItem('rentigo_customer_logged_out', 'true');
      localStorage.removeItem('rentigo_current_user');
      setActiveView('auth');
    } else if (currentRole === 'agency') {
      setAgencySession(null);
      localStorage.setItem('rentigo_agency_logged_out', 'true');
      localStorage.removeItem('rentigo_agency_session');
      setActiveView('auth');
    } else if (currentRole === 'admin') {
      setIsAdminLoggedIn(false);
      localStorage.setItem('rentigo_admin_logged_out', 'true');
      setActiveView('auth');
    }
  };

  const handleRegisterCustomer = (newUser: User) => {
    setUsers([newUser, ...users]);
    setCurrentUser(newUser);
    localStorage.setItem('rentigo_current_user', JSON.stringify(newUser));
    localStorage.removeItem('rentigo_customer_logged_out');
    setActiveView('home');
  };

  const handleRegisterAgency = (newAgency: Agency) => {
    setAgencies([newAgency, ...agencies]);
    setAgencySession(newAgency);
    localStorage.setItem('rentigo_agency_session', JSON.stringify(newAgency));
    localStorage.removeItem('rentigo_agency_logged_out');
    setActiveView('dashboard');
  };

  const handleLoginCustomer = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('rentigo_current_user', JSON.stringify(user));
    localStorage.removeItem('rentigo_customer_logged_out');
    setActiveView('home');
  };

  const handleLoginAgency = (agency: Agency) => {
    setAgencySession(agency);
    localStorage.setItem('rentigo_agency_session', JSON.stringify(agency));
    localStorage.removeItem('rentigo_agency_logged_out');
    setActiveView('dashboard');
  };

  const handleLoginAdmin = () => {
    setIsAdminLoggedIn(true);
    localStorage.removeItem('rentigo_admin_logged_out');
    setActiveView('dashboard');
  };

  const handleCancelAuth = () => {
    if (currentRole === 'customer') {
      setActiveView('home');
    } else {
      handleChangeRole('customer');
    }
  };

  // State manipulation triggers
  const handleAddBooking = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
  };

  const handleAddVehicle = (newVeh: Vehicle) => {
    setVehicles([newVeh, ...vehicles]);
  };

  const handleUpdateVehicle = (updatedVeh: Vehicle) => {
    setVehicles(vehicles.map(v => v.id === updatedVeh.id ? updatedVeh : v));
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
    setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };

  const handleUpdateBookingStatus = (id: string, status: 'Approved' | 'Rejected' | 'Cancelled') => {
    setBookings(bookings.map(b => {
      if (b.id === id) {
        const veh = vehicles.find(v => v.id === b.vehicleId);
        if (status === 'Approved') {
          if (veh) {
            handleUpdateVehicle({
              ...veh,
              status: 'Rented'
            });
          }
        } else if (status === 'Cancelled' || status === 'Rejected') {
          if (veh && veh.status === 'Rented') {
            handleUpdateVehicle({
              ...veh,
              status: 'Available'
            });
          }
        }
        return { ...b, status };
      }
      return b;
    }));
  };

  const handleAddMaintenance = (newMaint: Maintenance) => {
    setMaintenanceList([newMaint, ...maintenanceList]);
  };

  const handleApproveVehicle = (id: string) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, approved: true } : v));
  };

  const handleApproveAgency = (id: string, approve: boolean) => {
    setAgencies(agencies.map(a => a.id === id ? { ...a, status: approve ? 'Verified' : 'Suspended' } : a));
  };

  const handleToggleRule = (id: string) => {
    setPricingRules(pricingRules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleUpdateAgency = (updatedAgency: Agency) => {
    setAgencies(agencies.map(a => a.id === updatedAgency.id ? updatedAgency : a));
    if (agencySession && agencySession.id === updatedAgency.id) {
      setAgencySession(updatedAgency);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-800">
      
      {/* Platform Nav Header */}
      <Header
        currentRole={currentRole}
        userSession={currentUser}
        agencySession={agencySession}
        isAdminLoggedIn={isAdminLoggedIn}
        onChangeRole={handleChangeRole}
        onLogout={handleLogout}
        activeView={activeView}
        onChangeView={setActiveView}
      />

      {/* Main portal switcher */}
      <main className="flex-grow">
        {currentRole === 'customer' && activeView === 'auth' && (
          <AuthPortal
            role="customer"
            usersList={users}
            agenciesList={agencies}
            onRegisterCustomer={handleRegisterCustomer}
            onRegisterAgency={handleRegisterAgency}
            onLoginCustomer={handleLoginCustomer}
            onLoginAgency={handleLoginAgency}
            onLoginAdmin={handleLoginAdmin}
            onCancel={handleCancelAuth}
          />
        )}

        {currentRole === 'customer' && activeView !== 'auth' && (
          <CustomerPortal
            activeView={activeView}
            onChangeView={setActiveView}
            vehicles={vehicles}
            bookings={bookings}
            currentUser={currentUser}
            onAddBooking={handleAddBooking}
            onUpdateUser={handleUpdateUser}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateBooking={handleUpdateBooking}
          />
        )}

        {currentRole === 'agency' && (!agencySession || activeView === 'auth' ? (
          <AuthPortal
            role="agency"
            usersList={users}
            agenciesList={agencies}
            onRegisterCustomer={handleRegisterCustomer}
            onRegisterAgency={handleRegisterAgency}
            onLoginCustomer={handleLoginCustomer}
            onLoginAgency={handleLoginAgency}
            onLoginAdmin={handleLoginAdmin}
            onCancel={handleCancelAuth}
          />
        ) : (
          <AgencyPortal
            activeView={activeView}
            onChangeView={setActiveView}
            vehicles={vehicles}
            bookings={bookings}
            maintenanceList={maintenanceList}
            agencySession={agencySession}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onAddMaintenance={handleAddMaintenance}
            onUpdateAgency={handleUpdateAgency}
          />
        ))}

        {currentRole === 'admin' && (!isAdminLoggedIn || activeView === 'auth' ? (
          <AuthPortal
            role="admin"
            usersList={users}
            agenciesList={agencies}
            onRegisterCustomer={handleRegisterCustomer}
            onRegisterAgency={handleRegisterAgency}
            onLoginCustomer={handleLoginCustomer}
            onLoginAgency={handleLoginAgency}
            onLoginAdmin={handleLoginAdmin}
            onCancel={handleCancelAuth}
          />
        ) : (
          <AdminPortal
            activeView={activeView}
            onChangeView={setActiveView}
            users={users}
            vehicles={vehicles}
            bookings={bookings}
            agencies={agencies}
            pricingClasses={pricingClasses}
            pricingRules={pricingRules}
            systemAlerts={systemAlerts}
            onApproveVehicle={handleApproveVehicle}
            onApproveAgency={handleApproveAgency}
            onToggleRule={handleToggleRule}
            onUpdateUser={handleUpdateUser}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        ))}
      </main>

      {/* Platform footer */}
      <Footer 
        currentRole={currentRole} 
        onChangeView={(view) => {
          if (['about', 'story', 'careers', 'corporate', 'privacy', 'terms', 'cookies', 'help', 'emergency', 'hubs'].includes(view)) {
            setCurrentRole('customer');
            localStorage.setItem('rentigo_role', 'customer');
          }
          setActiveView(view);
        }} 
        onLoginRedirect={(role) => {
          setCurrentRole(role);
          localStorage.setItem('rentigo_role', role);
          setActiveView('auth');
        }}
      />

    </div>
  );
}
