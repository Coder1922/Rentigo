import { Car, LogOut, Settings, Shield, User, Menu, RefreshCw, Layers, LogIn } from 'lucide-react';
import { User as UserType, Agency } from '../types';

interface HeaderProps {
  currentRole: 'customer' | 'agency' | 'admin';
  userSession: UserType | null;
  agencySession: Agency | null;
  isAdminLoggedIn: boolean;
  onChangeRole: (role: 'customer' | 'agency' | 'admin') => void;
  onLogout: () => void;
  activeView: string;
  onChangeView: (view: string) => void;
}

export default function Header({
  currentRole,
  userSession,
  agencySession,
  isAdminLoggedIn,
  onChangeRole,
  onLogout,
  activeView,
  onChangeView
}: HeaderProps) {

  const isLoginPage = activeView === 'auth' || 
                      (currentRole === 'agency' && !agencySession) || 
                      (currentRole === 'admin' && !isAdminLoggedIn);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-orange-500 to-indigo-600"></div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onChangeView('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="bg-grey-500 text-white p-1 rounded-xl group-hover:scale-105 transition-all duration-300 shadow-sm flex items-center justify-center">
            <img src="/logo_img.png" className="h-10 w-auto group-hover:scale-105 transition-all duration-300"/>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-blue-600 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
              RentiGo
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
              {currentRole === 'admin' ? 'Admin Node' : currentRole === 'agency' ? 'Agency Network' : 'Mobility Global'}
            </span>
          </div>
        </div>

        {/* Dynamic Nav Links */}
        {!isLoginPage && (
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
            {currentRole === 'customer' && (
              <>
                <button
                  onClick={() => onChangeView('home')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeView === 'home' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => onChangeView('search')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeView === 'search' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  Search
                </button>
                <button
                  onClick={() => onChangeView('bookings')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeView === 'bookings' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  My Bookings
                </button>
                <button
                  onClick={() => onChangeView('about')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeView === 'about' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  About Us
                </button>
              </>
            )}

            {currentRole === 'agency' && (
              <>
                <button
                  onClick={() => onChangeView('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeView === 'dashboard' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onChangeView('fleet')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeView === 'fleet' || activeView === 'add_fleet' || activeView === 'edit_fleet' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  Fleet
                </button>
                <button
                  onClick={() => onChangeView('requests')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeView === 'requests' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  Requests
                </button>
                <button
                  onClick={() => onChangeView('maintenance')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeView === 'maintenance' || activeView === 'schedule_maintenance' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  Maintenance
                </button>
              </>
            )}

            
          </nav>
        )}

        {/* User Context & Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Quick Config Icon */}
          <button 
            onClick={() => onChangeView('settings')}
            className={`w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-all ${
              activeView === 'settings' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Profile Settings"
          >
            <Settings className="w-5 h-5 hover:rotate-45 transition-transform" />
          </button>

          {/* Account Profile Status */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 pl-3 pr-2 py-1 rounded-xl">
            <div className="text-right hidden sm:block">
              {currentRole === 'customer' && (
                <>
                  <p className="text-xs font-bold text-slate-800 leading-none">
                    {userSession ? userSession.name : 'Guest User'}
                  </p>
                  <p className="text-[10px] text-blue-600 uppercase tracking-widest font-extrabold mt-1">
                    {userSession ? 'Premium Member' : 'Click to Sign In'}
                  </p>
                </>
              )}
              {currentRole === 'agency' && (
                <>
                  <p className="text-xs font-bold text-slate-800 leading-none">
                    {agencySession ? agencySession.name : 'Guest Partner'}
                  </p>
                  <p className="text-[10px] text-orange-600 uppercase tracking-widest font-extrabold mt-1">
                    {agencySession ? 'Fleet Owner' : 'Check In Partners'}
                  </p>
                </>
              )}
              {currentRole === 'admin' && (
                <>
                  <p className="text-xs font-bold text-slate-800 leading-none">
                    {isAdminLoggedIn ? 'Alexander Sterling' : 'Unauthenticated'}
                  </p>
                  <p className="text-[10px] text-indigo-600 uppercase tracking-widest font-extrabold mt-1">
                    {isAdminLoggedIn ? 'Systems Root' : 'Credentials Locked'}
                  </p>
                </>
              )}
            </div>

            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden flex items-center justify-center shadow-sm">
              {currentRole === 'customer' && userSession?.avatar ? (
                <img src={userSession.avatar} alt="User" className="w-full h-full object-cover" />
              ) : currentRole === 'agency' && agencySession?.avatar ? (
                <img src={agencySession.avatar} alt="Agency" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-600" />
              )}
            </div>

            {/* Logout/Login Trigger */}
            {((currentRole === 'customer' && userSession) || 
              (currentRole === 'agency' && agencySession) || 
              (currentRole === 'admin' && isAdminLoggedIn)) ? (
              <button 
                onClick={onLogout}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 transition-all ml-1"
                title="Logout Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => onChangeView('auth')}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all ml-1 animate-pulse"
                title="Sign In / Register"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
