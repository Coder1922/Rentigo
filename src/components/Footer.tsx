import { Car, Mail, Share2, Globe, ChevronRight } from 'lucide-react';

interface FooterProps {
  currentRole: 'customer' | 'agency' | 'admin';
  onChangeView: (view: string) => void;
  onLoginRedirect: (role: 'customer' | 'agency' | 'admin') => void;
}

export default function Footer({ currentRole, onChangeView, onLoginRedirect }: FooterProps) {
  return (
    <footer className="bg-sky-500 pt-1 border-t-2 border-sky-400">
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 pt-16 pb-12 px-4 shadow-2xl relative overflow-hidden text-slate-100">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20 text-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
            
            {/* Brand Column */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 cursor-pointer group mb-6">
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
              <p className="text-slate-500 text-sm mb-6 leading-relaxed pr-2 sm:pr-6">
                Leading the way in global mobility solutions with an integrated responsive fleet tailored for professional performance and ultimate personal comfort.
              </p>
              <div className="flex gap-3">
                <a 
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 transition-all shadow-sm"
                  title="Global network"
                >
                  <Globe className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:support@rentigo.in"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 transition-all shadow-sm"
                  title="Email Desk"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a 
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 transition-all shadow-sm"
                  title="Share platform"
                >
                  <Share2 className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
              
              {/* Column 1 - Company */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-2">
                  Company
                </h4>
                <button 
                  onClick={() => onChangeView('story')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Operational Story
                </button>
                <button 
                  onClick={() => onChangeView('careers')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Careers Network
                </button>
                <button 
                  onClick={() => onChangeView('corporate')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Corporate Accounts
                </button>
              </div>

              {/* Column 2 - Legal */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-2">
                  Legal
                </h4>
                <button
                  onClick={() => onChangeView('privacy')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Privacy Charter
                </button>
                <button 
                  onClick={() => onChangeView('terms')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Terms of Service
                </button>
                <button 
                  onClick={() => onChangeView('cookies')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Cookie Preferences
                </button>
              </div>

              {/* Column 3 - Support */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-2">
                  Support
                </h4>
                <button
                  onClick={() => onChangeView('help')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Help Desk
                </button>
                <button 
                  onClick={() => onChangeView('emergency')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Emergency Helpline
                </button>
                <button 
                  onClick={() => onChangeView('hubs')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Hub Terminals
                </button>
              </div>

              {/* Column 4 - Portals */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-2">
                  Portals
                </h4>
                <button
                  onClick={() => onLoginRedirect('customer')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150 font-semibold"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Customer Login
                </button>
                <button
                  onClick={() => onLoginRedirect('agency')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150 font-semibold"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Agency Login
                </button>
                <button
                  onClick={() => onLoginRedirect('admin')}
                  className="text-slate-500 hover:text-blue-600 text-sm text-left flex items-center gap-1.5 transition-all duration-150 font-semibold"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500/80" /> Admin Access
                </button>
              </div>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
            <span>
              &copy; 2026 Rentigo Global Mobility Corporation. All rights reserved.
            </span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-600 transition-colors">Sitemap</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Compliance Accessibility</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
