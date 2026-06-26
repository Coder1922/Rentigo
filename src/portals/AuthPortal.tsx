import React, { useState } from 'react';
import { 
  Shield, Mail, Lock, Phone, User, MapPin, Briefcase, FileText, Calendar, 
  Award, Eye, EyeOff, CheckCircle, ArrowRight, Activity, AlertCircle, Building2,
  Fingerprint, Sparkles, Key, Check, UserCheck
} from 'lucide-react';
import { User as UserType, Agency } from '../types';

interface AuthPortalProps {
  role: 'customer' | 'agency' | 'admin';
  usersList: UserType[];
  agenciesList: Agency[];
  onRegisterCustomer: (newUser: UserType) => void;
  onRegisterAgency: (newAgency: Agency) => void;
  onLoginCustomer: (user: UserType) => void;
  onLoginAgency: (agency: Agency) => void;
  onLoginAdmin: () => void;
  onCancel: () => void;
}

export default function AuthPortal({
  role,
  usersList,
  agenciesList,
  onRegisterCustomer,
  onRegisterAgency,
  onLoginCustomer,
  onLoginAgency,
  onLoginAdmin,
  onCancel
}: AuthPortalProps) {
  // Navigation: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states - Customer
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '1995-08-15',
    gender: 'male',
    license: '',
    city: 'Surat',
    zip: '',
    address: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'
  });

  // Pre-configured avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop', // Female 1
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop', // Male 1
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop', // Female 2
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop', // Male 2
  ];

  // Form states - Agency
  const [agencyForm, setAgencyForm] = useState({
    name: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: 'Surat',
    zip: '',
    fleetSize: '6-20',
    taxId: '',
    tier: 'Standard' as 'Standard' | 'Premium',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=250&auto=format&fit=crop'
  });

  // Brand logos presets
  const logoPresets = [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=250&auto=format&fit=crop', // High Tech
    'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=250&auto=format&fit=crop', // Corporate
    'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=250&auto=format&fit=crop', // Modern Hub
  ];

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin inputs
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleDemoLogin = (email: string, roleType: 'customer' | 'agency' | 'admin') => {
    clearMessages();
    if (roleType === 'customer') {
      const found = usersList.find(u => u.email === email && u.role === 'customer');
      if (found) {
        onLoginCustomer(found);
      } else {
        setErrorMsg("Demo customer not found in system state.");
      }
    } else if (roleType === 'agency') {
      const found = agenciesList.find(a => a.email === email);
      if (found) {
        onLoginAgency(found);
      } else {
        setErrorMsg("Demo agency not found in system state.");
      }
    } else {
      onLoginAdmin();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!loginEmail) {
      setErrorMsg('Please specify your registered email address.');
      return;
    }

    if (!loginPassword) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    if (role === 'customer') {
      const user = usersList.find(
        u => u.email.toLowerCase().trim() === loginEmail.toLowerCase().trim() && u.role === 'customer'
      );
      if (user) {
        // Strict Password Check
        if (user.password && user.password !== loginPassword) {
          setErrorMsg('Incorrect password. Please verify security parameters.');
          return;
        }
        setSuccessMsg(`Welcome back, ${user.name}! Logging you in Safely.`);
        setTimeout(() => onLoginCustomer(user), 1000);
      } else {
        setErrorMsg('No customer account found with this email. Please check or register.');
      }
    } else if (role === 'agency') {
      const agency = agenciesList.find(
        a => a.email.toLowerCase().trim() === loginEmail.toLowerCase().trim()
      );
      if (agency) {
        // Strict Password Check
        if (agency.password && agency.password !== loginPassword) {
          setErrorMsg('Incorrect password. Please verify security parameters.');
          return;
        }
        setSuccessMsg(`Welcome, Partner ${agency.name}! Logging you into the Hub.`);
        setTimeout(() => onLoginAgency(agency), 1000);
      } else {
        setErrorMsg('No agency account found with this email. Please check or register.');
      }
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!adminEmail || !adminPasscode) {
      setErrorMsg('Enter both root parameters safely.');
      return;
    }

    // Verify admin strictly using email admin@rentigo.com and code admin123
    if (adminEmail.toLowerCase().trim() === 'admin@rentigo.com' && (adminPasscode === 'admin123' || adminPasscode === 'root')) {
      setSuccessMsg('Secured Access Verified. Booting RentiGo System Node.');
      setTimeout(() => onLoginAdmin(), 1000);
    } else {
      setErrorMsg('Unauthorized admin credentials. Please provide valid root credentials.');
    }
  };

  const handleCustomerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const { name, email, phone, password, confirmPassword, dob, gender, license, city, zip, address, avatar } = customerForm;

    // 1. Required fields check
    if (!name || !email || !phone || !password) {
      setErrorMsg('Please complete all required customer parameters.');
      return;
    }

    // 2. Full Name validation
    if (name.trim().length < 3) {
      setErrorMsg('Full name must be at least 3 characters long.');
      return;
    }

    // 3. Email format regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address (e.g., alex@example.com).');
      return;
    }

    // 4. Phone number digits check (minimum 10 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setErrorMsg('Phone number must contain at least 10 digits.');
      return;
    }

    // 5. Password matching check
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify character integrity.');
      return;
    }

    // 6. Password strength check
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMsg('Password must contain at least one letter and one number for proper security.');
      return;
    }

    // 7. Minimum age check (must be at least 18)
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        setErrorMsg('You must be at least 18 years old to register and rent vehicles.');
        return;
      }
    }

    // 8. Check if email already registered
    if (usersList.some(u => u.email.toLowerCase().trim() === email.toLowerCase().trim())) {
      setErrorMsg('This email is already registered as a Customer. Please log in.');
      return;
    }

    const newUser: UserType = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      dob,
      gender,
      license: license || '',
      city,
      zip,
      address,
      role: 'customer',
      avatar,
      password // Strict password storage
    };

    setSuccessMsg('Customer profile verified and compiled. Storing state cache!');
    setTimeout(() => {
      onRegisterCustomer(newUser);
    }, 1200);
  };

  const handleAgencyRegister = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const { name, ownerName, email, password, confirmPassword, phone, address, city, zip, fleetSize, taxId, tier, avatar } = agencyForm;

    // 1. Required fields check
    if (!name || !ownerName || !email || !phone || !taxId || !address) {
      setErrorMsg('Please specify all enterprise registration metadata fields.');
      return;
    }

    // 2. Agency Name validation
    if (name.trim().length < 3) {
      setErrorMsg('Agency / Brand Name must be at least 3 characters long.');
      return;
    }

    // 3. Owner Name validation
    if (ownerName.trim().length < 3) {
      setErrorMsg('Owner Full Name must be at least 3 characters long.');
      return;
    }

    // 4. Email format regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid enterprise email address.');
      return;
    }

    // 5. Phone number validation
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setErrorMsg('Business phone number must contain at least 10 digits.');
      return;
    }

    // 6. Password matching check
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify password integrity.');
      return;
    }

    // 7. Password strength check
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMsg('Password must contain at least one letter and one number for proper security.');
      return;
    }

    // 8. Tax / GST validation
    if (taxId.trim().length < 5) {
      setErrorMsg('Tax ID/GST number must be at least 5 alphanumeric characters.');
      return;
    }

    // 9. Street Address check
    if (address.trim().length < 8) {
      setErrorMsg('Please specify a complete business street address (at least 8 characters).');
      return;
    }

    // 10. Check if agency email already registered
    if (agenciesList.some(a => a.email.toLowerCase().trim() === email.toLowerCase().trim())) {
      setErrorMsg('An agency with this email is already registered.');
      return;
    }

    const newAgency: Agency = {
      id: `agency_${Date.now()}`,
      name,
      ownerName,
      email,
      phone,
      address,
      city,
      zip,
      fleetSize,
      taxId,
      tier,
      status: 'Verified', // Auto-approved for frictionless demo testing
      avatar,
      password // Strict password storage
    };

    setSuccessMsg('Agency credentials registered. Initializing Fleet Dashboard!');
    setTimeout(() => {
      onRegisterAgency(newAgency);
    }, 1200);
  };

  // Pre-configured style selectors based on role
  const roleStyles = {
    customer: {
      accent: 'blue',
      bgColor: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white border border-blue-300/30',
      hoverColor: 'hover:from-blue-400 hover:to-blue-600 hover:shadow-blue-500/15',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200/80',
      tintBg: 'bg-blue-50/40',
      bannerText: 'Safe Driving Mobility Auth Node',
      icon: <User className="w-6 h-6 text-blue-600 animate-pulse" />
    },
    agency: {
      accent: 'blue',
      bgColor: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white border border-blue-400/30',
      hoverColor: 'hover:from-blue-500 hover:to-blue-750 hover:shadow-blue-600/15',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300/80',
      tintBg: 'bg-blue-50/40',
      bannerText: 'Agency Fleet Integration Register',
      icon: <Building2 className="w-6 h-6 text-blue-600 animate-pulse" />
    },
    admin: {
      accent: 'blue',
      bgColor: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-750 text-white border border-blue-300/30',
      hoverColor: 'hover:from-blue-400 hover:to-blue-550 hover:shadow-blue-500/10',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200/80',
      tintBg: 'bg-blue-50/40',
      bannerText: 'Prestige Authority Control Terminal',
      icon: <Shield className="w-6 h-6 text-blue-600 animate-pulse" />
    }
  };

  const style = roleStyles[role];

  const bgImages = {
    customer: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1500&auto=format&fit=crop',
    agency: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1500&auto=format&fit=crop',
    admin: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1800&auto=format&fit=crop'
  };

  return (
    <div 
      className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat relative flex flex-col justify-center items-center overflow-hidden transition-all duration-750"
      style={{ backgroundImage: `url(${bgImages[role] || bgImages.customer})` }}
      id="auth-portal-root"
    >
      {/* High-quality modern dark/colorful gradient overlay mask to make content pop */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-blue-950/80 to-slate-950/75" />

      {/* Futuristic colourful glowing highlights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Main glass card inner container wrapper */}
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-10 animate-fade-in">
        
        {/* Header Profile Info branding with glass layer */}
        <div className="text-center space-y-3 max-w-lg mx-auto backdrop-blur-md rounded-3xl p-6 border shadow-2xl bg-blue-50/60 border-blue-200/60 text-slate-900 shadow-blue-100/50">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg transition-transform hover:scale-105 hover:rotate-3 duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-blue-100/30 text-blue-600">
            {style.icon}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm inline-block bg-blue-100 text-blue-800 border-blue-200/60 animate-pulse">
              {style.bannerText}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 text-shadow-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-blue-900 to-blue-800">
              {role.toUpperCase()} SYSTEM ACCESS
            </h2>
            <p className="text-xs mt-2 font-medium text-slate-600">
              {role === 'customer' 
                ? 'Synchronized rental checkpoints for verified customers.' 
                : role === 'agency' 
                ? 'Partner terminal access to list vehicles and audit checks.' 
                : 'Root access to track systems, metrics, and configurations.'
              }
            </p>
          </div>
        </div>

        <div className="w-full max-w-xl mx-auto">
          
          {/* The Interactive Form (Login/Registration) */}
          <div className="backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border bg-white/95 border-blue-200/50 text-slate-800 shadow-blue-100/45 transition-all duration-350">
          
          {/* Form Switcher - Hide for Admin */}
          {role !== 'admin' && (
            <div className="grid grid-cols-2 bg-blue-50/50 p-1.5 rounded-2xl mb-6 border border-blue-100/50">
              <button
                onClick={() => { setMode('login'); clearMessages(); }}
                className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white shadow-md text-blue-700' : 'text-slate-500 hover:text-blue-650'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('register'); clearMessages(); }}
                className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-white shadow-md text-blue-700' : 'text-slate-500 hover:text-blue-650'
                }`}
              >
                Sign Up / Register
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 text-xs text-red-700 flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-6 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORMS */}
          {mode === 'login' && role !== 'admin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6 font-semibold text-slate-700 text-xs animate-fade-in">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Email Address</label>
                  <span className="text-[8px] bg-blue-50 text-blue-800 border border-blue-200/60 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Secured Link</span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. demo@rentigo.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                  <Mail className="w-4 h-4 text-blue-650/80 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Security Password</label>
                  <span className="text-[8px] bg-blue-50 text-blue-800 border border-blue-200/60 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">AES Shield</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all placeholder:text-slate-400"
                    required
                  />
                  <Lock className="w-4 h-4 text-blue-650/80 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-blue-700 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-xl uppercase tracking-widest text-xs font-black text-white shadow-md transition-all ${style.bgColor} ${style.hoverColor} flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_24px_rgba(37,99,235,0.15)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.3)] duration-300 border border-blue-400/20`}
              >
                <Fingerprint className="w-4.5 h-4.5" />
                Sign In securely
              </button>
            </form>
          )}

          {/* REGISTER FORM: CUSTOMER */}
          {mode === 'register' && role === 'customer' && (
            <form onSubmit={handleCustomerRegister} className="space-y-6 font-semibold text-slate-700 text-xs animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Liam Sterling"
                      value={customerForm.name}
                      onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                      required
                    />
                    <User className="w-4 h-4 text-blue-650/80 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Email Address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="customer@gmail.com"
                      value={customerForm.email}
                      onChange={e => setCustomerForm({...customerForm, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                      required
                    />
                    <Mail className="w-4 h-4 text-blue-650/80 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Phone Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+91 99999 12345"
                      value={customerForm.phone}
                      onChange={e => setCustomerForm({...customerForm, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                      required
                    />
                    <Phone className="w-4 h-4 text-blue-650/80 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Birth Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={customerForm.dob}
                      onChange={e => setCustomerForm({...customerForm, dob: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    />
                    <Calendar className="w-4 h-4 text-blue-650/80 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Create Password *</label>
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={customerForm.password}
                    onChange={e => setCustomerForm({...customerForm, password: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Confirm Password *</label>
                  <input
                    type="password"
                    placeholder="Verify Password"
                    value={customerForm.confirmPassword}
                    onChange={e => setCustomerForm({...customerForm, confirmPassword: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Operating Region City</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all cursor-pointer"
                    value={customerForm.city}
                    onChange={e => setCustomerForm({...customerForm, city: e.target.value})}
                  >
                    <option value="Surat">Surat</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Rajkot">Rajkot</option>
                  </select>
                </div>
              </div>

              {/* Profile Avatar Picker */}
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Choose Profile Avatar</label>
                <div className="flex gap-4 items-center">
                  <img 
                    src={customerForm.avatar} 
                    alt="Active Avatar" 
                    className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover shadow-sm"
                  />
                  <div className="flex gap-2">
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomerForm({...customerForm, avatar: preset})}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          customerForm.avatar === preset ? 'border-blue-600 scale-110 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-450 hover:to-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_8px_24px_rgba(37,99,235,0.15)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.3)] transition-all duration-300 mt-4 cursor-pointer border border-blue-400/20 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4.5 h-4.5" />
                Register & Verify Profile
              </button>
            </form>
          )}

          {/* REGISTER FORM: AGENCY */}
          {mode === 'register' && role === 'agency' && (
            <form onSubmit={handleAgencyRegister} className="space-y-6 font-semibold text-slate-700 text-xs animate-fade-in">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Agency / Brand Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Star Mobility Rentals"
                    value={agencyForm.name}
                    onChange={e => setAgencyForm({...agencyForm, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Owner Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Robert Chen"
                    value={agencyForm.ownerName}
                    onChange={e => setAgencyForm({...agencyForm, ownerName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Email Address *</label>
                  <input
                    type="email"
                    placeholder="enterprise@rentigo.com"
                    value={agencyForm.email}
                    onChange={e => setAgencyForm({...agencyForm, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Mobile/Business Phone *</label>
                  <input
                    type="tel"
                    placeholder="+91 99999 90000"
                    value={agencyForm.phone}
                    onChange={e => setAgencyForm({...agencyForm, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Create Password *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={agencyForm.password}
                    onChange={e => setAgencyForm({...agencyForm, password: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Verify Password *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={agencyForm.confirmPassword}
                    onChange={e => setAgencyForm({...agencyForm, confirmPassword: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Primary City HQ</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all cursor-pointer"
                    value={agencyForm.city}
                    onChange={e => setAgencyForm({...agencyForm, city: e.target.value})}
                  >
                    <option value="Surat">Surat</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Rajkot">Rajkot</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Planned Fleet Size</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all cursor-pointer"
                    value={agencyForm.fleetSize}
                    onChange={e => setAgencyForm({...agencyForm, fleetSize: e.target.value})}
                  >
                    <option value="1-5">1 - 5 Vehicles</option>
                    <option value="6-20">6 - 20 Vehicles</option>
                    <option value="21-50">21 - 50 Vehicles</option>
                    <option value="50+">50+ Mega Fleet</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Tax/GST No. *</label>
                  <input
                    type="text"
                    placeholder="GSTIN-TX982A"
                    value={agencyForm.taxId}
                    onChange={e => setAgencyForm({...agencyForm, taxId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Business Street Address *</label>
                <div className="relative animate-fade-in">
                  <input
                    type="text"
                    placeholder="e.g. 1500 Corporate Ring Rd"
                    value={agencyForm.address}
                    onChange={e => setAgencyForm({...agencyForm, address: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                  <MapPin className="w-4 h-4 text-blue-650/80 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Logo Picker */}
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Choose Agency Hub Logo</label>
                <div className="flex gap-4 items-center">
                  <img 
                    src={agencyForm.avatar} 
                    alt="Active Logo" 
                    className="w-12 h-12 rounded-xl border-2 border-blue-500 object-cover shadow-sm"
                  />
                  <div className="flex gap-2">
                    {logoPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAgencyForm({...agencyForm, avatar: preset})}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          agencyForm.avatar === preset ? 'border-blue-600 scale-110 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt={`Logo ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-450 hover:to-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_8px_24px_rgba(37,99,235,0.15)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.3)] transition-all duration-300 mt-4 cursor-pointer border border-blue-400/20 flex items-center justify-center gap-2"
              >
                <Building2 className="w-4.5 h-4.5" />
                Register Corporate Agency
              </button>
            </form>
          )}

          {/* ADMIN LOGIN FORM */}
          {role === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-6 font-semibold text-slate-700 text-xs">
              
              {/* Prestige Credentials Quick Auto-Fill Card */}
              <div className="bg-gradient-to-br from-blue-50/50 via-white to-white border border-blue-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
                {/* Diagonal subtle blue line */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-200/20 to-transparent pointer-events-none" />
                
                <div className="text-left space-y-1 relative z-10">
                  <p className="font-extrabold text-blue-850 text-xs flex items-center gap-1.5 tracking-wide uppercase">
                    <Key className="w-3.5 h-3.5 text-blue-650" />
                    Prestige Demo Passkey
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Auto-fill verified administrator credentials.</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setAdminEmail('admin@rentigo.com');
                    setAdminPasscode('admin123');
                    setSuccessMsg('Luxury Master Key Injected. Ready to command.');
                    setTimeout(() => clearMessages(), 2500);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-650 hover:from-blue-450 hover:to-blue-550 text-white text-[10px] font-black px-5 py-2.5 rounded-xl border border-blue-400/20 transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_6px_18px_rgba(37,99,235,0.3)] uppercase tracking-wider relative z-10"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                  Auto-Fill Keys
                </button>
              </div>

              {/* Input Fields */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Administrator Email Address</label>
                  <span className="text-[8px] bg-blue-50 text-blue-800 border border-blue-200 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Root Access</span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all"
                    required
                  />
                  <Mail className="w-4 h-4 text-blue-650/80 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Root System Passcode</label>
                  <span className="text-[8px] bg-blue-50 text-blue-800 border border-blue-200 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Security Shield</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter passcode"
                    value={adminPasscode}
                    onChange={e => setAdminPasscode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs font-semibold text-slate-800 transition-all placeholder:text-slate-400"
                    required
                  />
                  <Lock className="w-4 h-4 text-blue-650/80 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-blue-700 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Secure Command CTA Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-450 hover:to-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_8px_24px_rgba(37,99,235,0.15)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.3)] transition-all duration-300 mt-4 cursor-pointer flex items-center justify-center gap-2 border border-blue-400/20"
              >
                <Fingerprint className="w-4.5 h-4.5 animate-pulse" />
                Establish Secure Operations
              </button>

            </form>
          )}

          {/* Quick Hub bypass button */}
          <div className={`mt-8 border-t pt-5 text-center ${
            role === 'admin' ? 'border-blue-200' : 'border-slate-100'
          }`}>
            <button
              onClick={onCancel}
              className={`font-bold uppercase tracking-wider text-[10px] leading-none transition-colors cursor-pointer ${
                role === 'admin' 
                  ? 'text-slate-500 hover:text-blue-750' 
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              ← Cancel Auth &amp; Return as Guest
            </button>
          </div>

        </div>

      </div>

    </div>
    </div>
  );
}
